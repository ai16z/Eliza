import type PinataClient from "@pinata/sdk";

export async function uploadJSONToIPFS(
    pinata: PinataClient,
    jsonMetadata: any
): Promise<string> {
    const { IpfsHash } = await pinata.pinJSONToIPFS(jsonMetadata);
    return IpfsHash;
}
