import appleAppSiteAssociation from "public/static/apple-app-site-association.json"

describe("apple-app-site-association", () => {
  it("return correct json", () => {
    cy.request({
      method: "GET",
      url: "/apple-app-site-association",
    }).then((response) => {
      expect(response.body).to.deep.include(appleAppSiteAssociation)
    })
  })
})
