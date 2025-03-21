address NeuralabsNFT {
module NFT {
    use std::signer;
    use std::string::String;
    use std::vector;
    use aptos_std::table::{Self, Table};
    use aptos_framework::timestamp;
    use aptos_framework::account;
    use aptos_framework::event::{Self, EventHandle};
    use aptos_std::hash;
    use aptos_std::bcs;
    
    // Error codes
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_NFT_DOES_NOT_EXIST: u64 = 2;
    const E_INVALID_LEVEL: u64 = 3;
    
    // Access levels (same as in the original contract)
    const ACCESS_NONE: u8 = 0;
    const ACCESS_USE_MODEL: u8 = 1;
    const ACCESS_RESALE: u8 = 2;
    const ACCESS_CREATE_REPLICA: u8 = 3;
    const ACCESS_VIEW_DOWNLOAD: u8 = 4;
    const ACCESS_EDIT_DATA: u8 = 5;
    const ACCESS_ABSOLUTE_OWNERSHIP: u8 = 6;
    
    // NFT struct
    struct NFTInfo has store, drop {
        id: u64,
        name: String,
        level_of_ownership: u8,
        creator: address,
        creation_date: u64,
        owner: address,
        hash_value: vector<u8>, // Hash of time, id, and owner
    }
    
    // Storage for NFT ownership
    struct NFTOwnership has key {
        nfts: Table<u64, NFTInfo>,
        next_token_id: u64,
        create_events: EventHandle<CreateEvent>,
        transfer_events: EventHandle<TransferEvent>,
        burn_events: EventHandle<BurnEvent>,
    }
    
    // Access control for NFTs
    struct NFTAccess has key {
        access_rights: Table<address, Table<u64, u8>>, // address -> token_id -> access_level
        default_access_levels: Table<u64, u8>, // token_id -> default_access_level
        access_grant_events: EventHandle<AccessGrantEvent>,
        access_revoke_events: EventHandle<AccessRevokeEvent>,
    }
    
    // Events
    struct CreateEvent has drop, store {
        token_id: u64,
        name: String,
        creator: address,
        timestamp: u64,
    }
    
    struct TransferEvent has drop, store {
        token_id: u64,
        from: address,
        to: address,
        timestamp: u64,
    }
    
    struct BurnEvent has drop, store {
        token_id: u64,
        owner: address,
        timestamp: u64,
    }
    
    struct AccessGrantEvent has drop, store {
        token_id: u64,
        user: address,
        access_level: u8,
        timestamp: u64,
    }
    
    struct AccessRevokeEvent has drop, store {
        token_id: u64,
        user: address,
        timestamp: u64,
    }
    
    // Initialize the module
    public entry fun initialize(account: &signer) {
        let account_addr = signer::address_of(account);
        
        if (!exists<NFTOwnership>(account_addr)) {
            move_to(account, NFTOwnership {
                nfts: table::new(),
                next_token_id: 1,
                create_events: account::new_event_handle<CreateEvent>(account),
                transfer_events: account::new_event_handle<TransferEvent>(account),
                burn_events: account::new_event_handle<BurnEvent>(account),
            });
        };
        
        if (!exists<NFTAccess>(account_addr)) {
            move_to(account, NFTAccess {
                access_rights: table::new(),
                default_access_levels: table::new(),
                access_grant_events: account::new_event_handle<AccessGrantEvent>(account),
                access_revoke_events: account::new_event_handle<AccessRevokeEvent>(account),
            });
        };
    }
    
    // Create a new NFT
    public entry fun create_nft(
        account: &signer,
        name: String,
        level_of_ownership: u8,
    ) acquires NFTOwnership, NFTAccess {
        let account_addr = signer::address_of(account);
        
        // Validate ownership level
        assert!(level_of_ownership > 0 && level_of_ownership <= 6, E_INVALID_LEVEL);
        
        // Get the NFT ownership resource
        let nft_ownership = borrow_global_mut<NFTOwnership>(account_addr);
        let token_id = nft_ownership.next_token_id;
        nft_ownership.next_token_id = nft_ownership.next_token_id + 1;
        
        // Generate hash
        let now = timestamp::now_microseconds();
        let hash_value = generate_hash(now, token_id, account_addr);
        
        // Create NFT info
        let nft_info = NFTInfo {
            id: token_id,
            name,
            level_of_ownership,
            creator: account_addr,
            creation_date: now,
            owner: account_addr,
            hash_value,
        };
        
        // Add to table
        table::add(&mut nft_ownership.nfts, token_id, nft_info);
        
        // Grant creator absolute ownership access
        grant_access(account, token_id, account_addr, ACCESS_ABSOLUTE_OWNERSHIP);
        
        // Emit create event
        event::emit_event(
            &mut nft_ownership.create_events,
            CreateEvent {
                token_id,
                name,
                creator: account_addr,
                timestamp: now,
            },
        );
    }
    
    // Transfer NFT
    public entry fun transfer_nft(
        account: &signer,
        recipient: address,
        token_id: u64,
    ) acquires NFTOwnership, NFTAccess {
        let sender = signer::address_of(account);
        
        let nft_ownership = borrow_global_mut<NFTOwnership>(sender);
        
        // Check if NFT exists and sender is owner
        assert!(table::contains(&nft_ownership.nfts, token_id), E_NFT_DOES_NOT_EXIST);
        let nft_info = table::borrow_mut(&mut nft_ownership.nfts, token_id);
        assert!(nft_info.owner == sender, E_NOT_AUTHORIZED);
        
        // Update owner
        nft_info.owner = recipient;
        
        // Update access rights - transfer current level to new owner
        let access_level = get_access_level(sender, token_id, sender);
        revoke_access(account, token_id, sender);
        grant_access(account, token_id, recipient, access_level);
        
        // Emit transfer event
        let now = timestamp::now_microseconds();
        event::emit_event(
            &mut nft_ownership.transfer_events,
            TransferEvent {
                token_id,
                from: sender,
                to: recipient,
                timestamp: now,
            },
        );
    }
    
    // Burn NFT
    public entry fun burn_nft(
        account: &signer,
        token_id: u64,
    ) acquires NFTOwnership, NFTAccess {
        let sender = signer::address_of(account);
        
        let nft_ownership = borrow_global_mut<NFTOwnership>(sender);
        
        // Check if NFT exists and sender is owner
        assert!(table::contains(&nft_ownership.nfts, token_id), E_NFT_DOES_NOT_EXIST);
        let nft_info = table::borrow(&nft_ownership.nfts, token_id);
        assert!(nft_info.owner == sender, E_NOT_AUTHORIZED);
        
        // Remove NFT
        let removed_nft = table::remove(&mut nft_ownership.nfts, token_id);
        
        // Remove access rights
        let nft_access = borrow_global_mut<NFTAccess>(sender);
        if (table::contains(&nft_access.default_access_levels, token_id)) {
            table::remove(&mut nft_access.default_access_levels, token_id);
        };
        
        // Emit burn event
        let now = timestamp::now_microseconds();
        event::emit_event(
            &mut nft_ownership.burn_events,
            BurnEvent {
                token_id,
                owner: removed_nft.owner,
                timestamp: now,
            },
        );
    }
    
    // Grant access to a user
    public entry fun grant_access(
        account: &signer,
        token_id: u64,
        user: address,
        access_level: u8,
    ) acquires NFTAccess {
        let account_addr = signer::address_of(account);
        let nft_access = borrow_global_mut<NFTAccess>(account_addr);
        
        // Create user table if it doesn't exist
        if (!table::contains(&nft_access.access_rights, user)) {
            table::add(&mut nft_access.access_rights, user, table::new<u64, u8>());
        };
        
        // Get user's access table
        let user_access = table::borrow_mut(&mut nft_access.access_rights, user);
        
        // Update or add access level
        if (table::contains(user_access, token_id)) {
            *table::borrow_mut(user_access, token_id) = access_level;
        } else {
            table::add(user_access, token_id, access_level);
        };
        
        // Emit grant event
        let now = timestamp::now_microseconds();
        event::emit_event(
            &mut nft_access.access_grant_events,
            AccessGrantEvent {
                token_id,
                user,
                access_level,
                timestamp: now,
            },
        );
    }
    
    // Revoke access from a user
    public entry fun revoke_access(
        account: &signer,
        token_id: u64,
        user: address,
    ) acquires NFTAccess {
        let account_addr = signer::address_of(account);
        let nft_access = borrow_global_mut<NFTAccess>(account_addr);
        
        if (table::contains(&nft_access.access_rights, user)) {
            let user_access = table::borrow_mut(&mut nft_access.access_rights, user);
            
            if (table::contains(user_access, token_id)) {
                table::remove(user_access, token_id);
                
                // Emit revoke event
                let now = timestamp::now_microseconds();
                event::emit_event(
                    &mut nft_access.access_revoke_events,
                    AccessRevokeEvent {
                        token_id,
                        user,
                        timestamp: now,
                    },
                );
            };
        };
    }
    
    // Set default access level
    public entry fun set_default_access_level(
        account: &signer,
        token_id: u64,
        access_level: u8,
    ) acquires NFTAccess, NFTOwnership {
        let account_addr = signer::address_of(account);
        
        // Check NFT ownership
        let nft_ownership = borrow_global<NFTOwnership>(account_addr);
        assert!(table::contains(&nft_ownership.nfts, token_id), E_NFT_DOES_NOT_EXIST);
        let nft_info = table::borrow(&nft_ownership.nfts, token_id);
        assert!(nft_info.owner == account_addr, E_NOT_AUTHORIZED);
        
        // Update default access level
        let nft_access = borrow_global_mut<NFTAccess>(account_addr);
        
        if (table::contains(&nft_access.default_access_levels, token_id)) {
            *table::borrow_mut(&mut nft_access.default_access_levels, token_id) = access_level;
        } else {
            table::add(&mut nft_access.default_access_levels, token_id, access_level);
        };
    }
    
    // Get access level for a user
    public fun get_access_level(
        owner: address,
        token_id: u64,
        user: address,
    ): u8 acquires NFTAccess {
        let nft_access = borrow_global<NFTAccess>(owner);
        
        // Check user-specific access
        if (table::contains(&nft_access.access_rights, user)) {
            let user_access = table::borrow(&nft_access.access_rights, user);
            
            if (table::contains(user_access, token_id)) {
                return *table::borrow(user_access, token_id);
            };
        };
        
        // Return default access level if exists
        if (table::contains(&nft_access.default_access_levels, token_id)) {
            return *table::borrow(&nft_access.default_access_levels, token_id);
        };
        
        // Return no access by default
        ACCESS_NONE
    }
    
    // Check if a user has minimum required access
    public fun check_minimum_access(
        owner: address,
        token_id: u64,
        user: address,
        required_access: u8
    ): bool acquires NFTAccess {
        let access_level = get_access_level(owner, token_id, user);
        access_level >= required_access
    }
    
    // Get NFT info
    public fun get_nft_info(
        owner: address,
        token_id: u64,
    ): (String, u8, address, u64, address, vector<u8>) acquires NFTOwnership {
        let nft_ownership = borrow_global<NFTOwnership>(owner);
        
        assert!(table::contains(&nft_ownership.nfts, token_id), E_NFT_DOES_NOT_EXIST);
        let nft_info = table::borrow(&nft_ownership.nfts, token_id);
        
        (
            nft_info.name,
            nft_info.level_of_ownership,
            nft_info.creator,
            nft_info.creation_date,
            nft_info.owner,
            nft_info.hash_value,
        )
    }
    
    // Generate hash from time, token ID, and owner
    fun generate_hash(time: u64, token_id: u64, owner: address): vector<u8> {
        let bytes = vector::empty<u8>();
        
        // Append timestamp bytes (8 bytes)
        let i = 0;
        while (i < 8) {
            vector::push_back(&mut bytes, ((time >> (i * 8)) & 0xFF) as u8);
            i = i + 1;
        };
        
        // Append token_id bytes (8 bytes)
        i = 0;
        while (i < 8) {
            vector::push_back(&mut bytes, ((token_id >> (i * 8)) & 0xFF) as u8);
            i = i + 1;
        };
        
        // Append owner address bytes
        let addr_bytes = bcs::to_bytes(&owner);
        vector::append(&mut bytes, addr_bytes);
        
        // Generate SHA3-256 hash
        hash::sha3_256(bytes)
    }
}
}