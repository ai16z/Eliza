import { PrimusCoreTLS,type Attestation } from "@primuslabs/zktls-core-sdk";

export const generateProof = async (
    endpoint: string,
    method: string,
    headers: Record<string, any>,
    body: string,
    responseParsePath: string
): Promise<Attestation> => {
    const zkTLS = new PrimusCoreTLS();
    await zkTLS.init(process.env.PRIMUS_APP_ID, process.env.PRIMUS_APP_SECRET);
    const requestParam = body
        ? {
              url: endpoint,
              method: method,
              header: headers,
              body: body,
          }
        : {
              url: endpoint,
              method: method,
              header: headers,
          };
    // console.log('requestParam:',requestParam)
    const attestationParams = zkTLS.generateRequestParams(requestParam, [
        {
            keyName: "content",
            parsePath: responseParsePath,
            parseType: "string",
        },
    ]);
    attestationParams.setAttMode({
        algorithmType: "proxytls",
    });
    return await zkTLS.startAttestation(attestationParams);
};

export const verifyProof = async (attestation: Attestation): Promise<boolean> => {
    const zkTLS = new PrimusCoreTLS();
    await zkTLS.init(process.env.PRIMUS_APP_ID, process.env.PRIMUS_APP_SECRET);
    return zkTLS.verifyAttestation(attestation);
};
