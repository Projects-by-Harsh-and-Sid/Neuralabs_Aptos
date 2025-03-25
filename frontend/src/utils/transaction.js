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
    if (!connected || wallet?.name !== "Pontem") {
      throw new Error("Wallet not connected or not Pontem");
    }
  
    if (!account?.address) {
      throw new Error("Account address not found");
    }
  
    try {
      const payload = {
        type: "entry_function_payload",
        function: `${contractAddress}::${moduleName}::${functionName}`,
        type_arguments: typeArguments || [],
        arguments: args || [],
      };
  
      const transaction = {
        sender: account.address,
        data: payload,
        options,
      };
  
      const response = await signAndSubmitTransaction(transaction);
  
      if (response.hash) {
        console.log("Transaction hash:", response.hash);
        return response.hash; // Return hash for further use if needed
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      throw error; // Re-throw for caller to handle if needed
    }
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