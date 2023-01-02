// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  const tokenId = req.query.tokenId;
  const name = `Crypto Dev #${tokenId}`
  const description = "Crypto Devs is an NFT collection for Web3 Developers";
  const image = `https://github.com/mecskyverse/NFT-Collection/blob/main/my-next-app/public/cyptoDevs/${Number(tokenId) -1}.svg`;  
 

  return res.json({
    name :name,
    description : description,
    image:image,
  })
}
