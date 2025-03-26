// src/utils/transaction.js

export const executeContractFunction = async (
    signAndSubmitTransaction,
    account,
    connected,
    wallet,
    contractAddress,
    moduleName,
    functionName,
    typeArguments,
    args,
    options = { maxGasAmount: "2000", gasUnitPrice: "100" }
  ) => {
    if (!connected) {
      throw new Error("Wallet not connected or not Pontem");
    }
  
    if (!account?.address) {
      throw new Error("Account address not found");
    }
  
    // try {
      const payload = {
        type: "entry_function_payload",
        function: `${contractAddress}::${moduleName}::${functionName}`,
        typeArguments: typeArguments || [],
        functionArguments: args || [],
      };

      console.log("Payload:", payload); // Log the payload for debugging
  
      const transaction = {
        sender: account.address,
        data: payload,
        options,
      };
  
      console.log("Transaction:", transaction); // Log the transaction for debugging

      const response = await signAndSubmitTransaction(transaction);

    console.log("Transaction response:", response); // Log the response for debugging
  
      if (response.hash) {
        console.log("Transaction hash:", response.hash);
        return response.hash; // Return hash for further use if needed
      }
    // } catch (error) {
    //   console.error("Transaction failed:", error);
    //   throw error; // Re-throw for caller to handle if needed
    // }
  };
  
  // Wrapper to use with React components
  export const useExecuteContractFunction = (
    signAndSubmitTransaction,
    account,
    connected,
    wallet
  ) => {
    return async (
      contractAddress,
      moduleName,
      functionName,
      typeArguments,
      args,
      options = {}
    ) => {
      return executeContractFunction(
        signAndSubmitTransaction,
        account,
        connected,
        wallet,
        contractAddress,
        moduleName,
        functionName,
        typeArguments,
        args, // Fixed: was using 'arguments' (reserved keyword)
        options
      );
    };
  };