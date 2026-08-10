package com.credencify.blockchainservice.service;

import com.credencify.blockchainservice.wrapper.CertificateStorage;
import com.credencify.blockchainservice.dto.response.request.StoreHashRequest;
import com.credencify.blockchainservice.dto.response.response.StoreHashResponse;
import com.credencify.blockchainservice.dto.response.response.VerifyHashResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.gas.DefaultGasProvider;
import org.web3j.utils.Numeric;

import java.math.BigInteger;
@Service
public class BlockchainServiceImpl implements BlockchainService {
    private final Web3j web3j;

    @Value("${contract.address}")
    private String contractAddress;

    @Value("${wallet.privateKey}")
    private String privateKey;
    private CertificateStorage contract;
    public BlockchainServiceImpl(Web3j web3j){
        this.web3j = web3j;
    }

    @Override
    public CertificateStorage getContract() {
        Credentials credentials = Credentials.create(privateKey);
        return CertificateStorage.load(
                contractAddress,
                web3j,
                credentials,
                new DefaultGasProvider()
        );
    }

    @Override
    public StoreHashResponse storeHash(StoreHashRequest req) throws Exception {
        byte[] hashBytes = Numeric.hexStringToByteArray(req.getHash());

        TransactionReceipt receipt = getContract()
                .storeHash(req.getCertificateId(), hashBytes) // String ID
                .send();

        StoreHashResponse response = new StoreHashResponse();
        response.setSuccess(receipt.isStatusOK());
        response.setMessage(receipt.isStatusOK() ? "Hash Stored Successfully" : "Transaction Failed");
        response.setBlockNumber(receipt.getBlockNumber().longValue());
        response.setTransactionHash(receipt.getTransactionHash());
        return response;
    }

    @Override
    public VerifyHashResponse getHash(String certificateId) throws Exception {
        byte[] hashBytes = getContract().getHash(certificateId).send();
        String hash = Numeric.toHexString(hashBytes);
        return new VerifyHashResponse(certificateId, hash);
    }
}
