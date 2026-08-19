package com.credencify.blockchainservice.service;

import com.credencify.blockchainservice.exceptions.DuplicateCertificateException;
import com.credencify.blockchainservice.exceptions.HashNotFoundException;
import com.credencify.blockchainservice.exceptions.TransactionFailedException;
import com.credencify.blockchainservice.wrapper.CertificateStorage;
import com.credencify.blockchainservice.dto.request.StoreHashRequest;
import com.credencify.blockchainservice.dto.response.StoreHashResponse;
import com.credencify.blockchainservice.dto.response.VerifyHashResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.exceptions.TransactionException;
import org.web3j.tx.gas.DefaultGasProvider;
import org.web3j.utils.Numeric;

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
        try {

            TransactionReceipt receipt = getContract()
                    .storeHash(req.getCertificateId(), hashBytes) // String ID
                    .send();
            if (!receipt.isStatusOK()) {
                throw new TransactionFailedException("The Transcation is failed due to Internal Reason");
            }
            StoreHashResponse response = new StoreHashResponse();

            response.setSuccess(receipt.isStatusOK());
            response.setMessage(receipt.isStatusOK() ? "Hash Stored Successfully" : "Transaction Failed");
            response.setBlockNumber(receipt.getBlockNumber().longValue());
            response.setTransactionHash(receipt.getTransactionHash());
            response.setCertificateHash(req.getHash());

            return response;
        }catch (TransactionException ex){
            if(ex.getMessage()!=null && ex.getMessage().contains("Certificate Alreay exists")){
                    throw new DuplicateCertificateException("Certificate ID : " + req.getCertificateId() + " is already Found on the Blockchain ");
            }
            throw ex;
        }
    }

    @Override
    public VerifyHashResponse getHash(String certificateId) throws Exception {
        byte[] hashBytes = getContract().getHash(certificateId).send();
        String hash = Numeric.toHexString(hashBytes);
        if(hash.equals("0x0") || hash.matches("^0x0+$") || hash.replace("0","").equalsIgnoreCase("x")){
            throw new HashNotFoundException("");
        }
        return new VerifyHashResponse(certificateId, hash);
    }
}
