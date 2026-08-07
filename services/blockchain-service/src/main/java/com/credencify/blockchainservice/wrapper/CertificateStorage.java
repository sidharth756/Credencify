package com.credencify.blockchainservice.wrapper;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import javax.annotation.processing.Generated;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.generated.Bytes32;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.RemoteCall;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.Contract;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.ContractGasProvider;

/**
 * <p>Auto generated code.
 * <p><strong>Do not modify!</strong>
 * <p>Please use the <a href="https://docs.web3j.io/command_line.html">web3j command line tools</a>,
 * or the org.web3j.codegen.SolidityFunctionWrapperGenerator in the 
 * <a href="https://github.com/LFDT-web3j/web3j/tree/main/codegen">codegen module</a> to update.
 *
 * <p>Generated with web3j version 1.8.0.
 */
@SuppressWarnings("rawtypes")
@Generated("org.web3j.codegen.SolidityFunctionWrapperGenerator")
public class CertificateStorage extends Contract {
    public static final String BINARY = "6080604052348015600e575f5ffd5b506104908061001c5f395ff3fe608060405234801561000f575f5ffd5b5060043610610034575f3560e01c806330c6caa4146100385780635b6beeb914610054575b5f5ffd5b610052600480360381019061004d91906102b1565b610084565b005b61006e6004803603810190610069919061030b565b61010b565b60405161007b9190610361565b60405180910390f35b5f5f1b5f8360405161009691906103cc565b908152602001604051809103902054146100e5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016100dc9061043c565b60405180910390fd5b805f836040516100f591906103cc565b9081526020016040518091039020819055505050565b5f5f8260405161011b91906103cc565b9081526020016040518091039020549050919050565b5f604051905090565b5f5ffd5b5f5ffd5b5f5ffd5b5f5ffd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b6101908261014a565b810181811067ffffffffffffffff821117156101af576101ae61015a565b5b80604052505050565b5f6101c1610131565b90506101cd8282610187565b919050565b5f67ffffffffffffffff8211156101ec576101eb61015a565b5b6101f58261014a565b9050602081019050919050565b828183375f83830152505050565b5f61022261021d846101d2565b6101b8565b90508281526020810184848401111561023e5761023d610146565b5b610249848285610202565b509392505050565b5f82601f83011261026557610264610142565b5b8135610275848260208601610210565b91505092915050565b5f819050919050565b6102908161027e565b811461029a575f5ffd5b50565b5f813590506102ab81610287565b92915050565b5f5f604083850312156102c7576102c661013a565b5b5f83013567ffffffffffffffff8111156102e4576102e361013e565b5b6102f085828601610251565b92505060206103018582860161029d565b9150509250929050565b5f602082840312156103205761031f61013a565b5b5f82013567ffffffffffffffff81111561033d5761033c61013e565b5b61034984828501610251565b91505092915050565b61035b8161027e565b82525050565b5f6020820190506103745f830184610352565b92915050565b5f81519050919050565b5f81905092915050565b8281835e5f83830152505050565b5f6103a68261037a565b6103b08185610384565b93506103c081856020860161038e565b80840191505092915050565b5f6103d7828461039c565b915081905092915050565b5f82825260208201905092915050565b7f436572746966696361746520416c7265617920657869737473000000000000005f82015250565b5f6104266019836103e2565b9150610431826103f2565b602082019050919050565b5f6020820190508181035f8301526104538161041a565b905091905056fea26469706673582212205e37c5ac0d849d68f4a7478aea3d808a7ea2747c73d4659f77ae9b17913b495c64736f6c63430008220033";

    private static String librariesLinkedBinary;

    public static final String FUNC_GETHASH = "getHash";

    public static final String FUNC_STOREHASH = "storeHash";

    @Deprecated
    protected CertificateStorage(String contractAddress, Web3j web3j, Credentials credentials,
            BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    protected CertificateStorage(String contractAddress, Web3j web3j, Credentials credentials,
            ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, credentials, contractGasProvider);
    }

    @Deprecated
    protected CertificateStorage(String contractAddress, Web3j web3j,
            TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    protected CertificateStorage(String contractAddress, Web3j web3j,
            TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public RemoteFunctionCall<byte[]> getHash(String certificateId) {
        final Function function = new Function(FUNC_GETHASH, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(certificateId)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Bytes32>() {}));
        return executeRemoteCallSingleValueReturn(function, byte[].class);
    }

    public RemoteFunctionCall<TransactionReceipt> storeHash(String certificateId, byte[] hash) {
        final Function function = new Function(
                FUNC_STOREHASH, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(certificateId), 
                new org.web3j.abi.datatypes.generated.Bytes32(hash)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    @Deprecated
    public static CertificateStorage load(String contractAddress, Web3j web3j,
            Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        return new CertificateStorage(contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    @Deprecated
    public static CertificateStorage load(String contractAddress, Web3j web3j,
            TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return new CertificateStorage(contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    public static CertificateStorage load(String contractAddress, Web3j web3j,
            Credentials credentials, ContractGasProvider contractGasProvider) {
        return new CertificateStorage(contractAddress, web3j, credentials, contractGasProvider);
    }

    public static CertificateStorage load(String contractAddress, Web3j web3j,
            TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        return new CertificateStorage(contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public static RemoteCall<CertificateStorage> deploy(Web3j web3j, Credentials credentials,
            ContractGasProvider contractGasProvider) {
        return deployRemoteCall(CertificateStorage.class, web3j, credentials, contractGasProvider, getDeploymentBinary(), "");
    }

    @Deprecated
    public static RemoteCall<CertificateStorage> deploy(Web3j web3j, Credentials credentials,
            BigInteger gasPrice, BigInteger gasLimit) {
        return deployRemoteCall(CertificateStorage.class, web3j, credentials, gasPrice, gasLimit, getDeploymentBinary(), "");
    }

    public static RemoteCall<CertificateStorage> deploy(Web3j web3j,
            TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        return deployRemoteCall(CertificateStorage.class, web3j, transactionManager, contractGasProvider, getDeploymentBinary(), "");
    }

    @Deprecated
    public static RemoteCall<CertificateStorage> deploy(Web3j web3j,
            TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return deployRemoteCall(CertificateStorage.class, web3j, transactionManager, gasPrice, gasLimit, getDeploymentBinary(), "");
    }

    public static void linkLibraries(List<Contract.LinkReference> references) {
        librariesLinkedBinary = linkBinaryWithReferences(BINARY, references);
    }

    private static String getDeploymentBinary() {
        if (librariesLinkedBinary != null) {
            return librariesLinkedBinary;
        } else {
            return BINARY;
        }
    }
}
