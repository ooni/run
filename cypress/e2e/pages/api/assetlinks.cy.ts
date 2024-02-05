import assetlinks from "public/static/assetlinks.json"

describe("assetlinks", () => {
  it("return correct json", () => {
    cy.request({
      method: "GET",
      url: "/.well-known/assetlinks.json",
    }).then((response) => {
      expect(response.body.length).to.eq(1)
      expect(response.body[0]).to.deep.include(assetlinks[0])
    })
  })
})
