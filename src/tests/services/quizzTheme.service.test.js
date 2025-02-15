// Importation des dépendances
const chai = require("chai"); // Bibliothèque Chai pour les assertions
const sinon = require("sinon"); // Bibliothèque Sinon.js pour les faux (spies, stubs, mocks)
const expect = chai.expect; // Méthode d'assertion "expect"

const quizzThemeService = require("../../services/quizzTheme.service")(); // Service de gestion des thèmes de quiz
const QuizzTheme = require("../../models/quizzTheme.model"); // Modèle de thème de quiz
const ValidationError = require("../../errors/ValidationError"); // Classe d'erreur pour la validation

// Description des tests pour le service quizzThemeService
describe("QuizzThemeService", function () {
  // Description du test : trouver tous les thèmes de quiz en fonction de critères de recherche
  describe("findAll", function () {
    it("should find all quizz themes based on criteria", async function () {
      const criteria = { category: "history" };
      const options = {
        page: 1,
        itemsPerPage: 10,
        order: { createdAt: "asc" },
      };
      const themes = [
        { _id: "1", title: "Ancient History" },
        { _id: "2", title: "Modern History" },
      ];

      const findStub = sinon.stub(QuizzTheme, "find");
      findStub.returns({
        limit: sinon.stub().returnsThis(),
        skip: sinon.stub().returnsThis(),
        sort: sinon.stub().returns(themes),
      });

      const result = await quizzThemeService.findAll(criteria, options);

      expect(result).to.deep.eql(themes);
      findStub.restore();
    });
  });

  // Description du test : créer un thème de quiz
  describe("create", function () {
    it("should create a quizz theme", async function () {
      const data = { title: "Ancient History" };
      const createdTheme = { _id: "1", ...data };

      const QuizzThemeMock = sinon.mock(QuizzTheme);
      QuizzThemeMock.expects("create").withArgs(data).resolves(createdTheme);

      const result = await quizzThemeService.create(data);

      expect(result).to.deep.eql(createdTheme);
      QuizzThemeMock.verify();
    });
  });

  // Description du test : trouver un thème de quiz par son identifiant
  describe("findOne", function () {
    it("should find a quizz theme by ID", async function () {
      const id = "1";
      const theme = { _id: id, title: "Ancient History" };

      const QuizzThemeMock = sinon.mock(QuizzTheme);
      QuizzThemeMock.expects("findById").withArgs(id).resolves(theme);

      const result = await quizzThemeService.findOne(id);

      expect(result).to.deep.eql(theme);
      QuizzThemeMock.verify();
    });
  });

  // Description du test : remplacer un thème de quiz
  describe("replaceOne", function () {
    it("should replace a quizz theme", async function () {
      const id = "1";
      const newData = { title: "Modern History" };
      const replacedTheme = { _id: id, ...newData };

      sinon.stub(quizzThemeService, "deleteOne").returns(true);
      sinon.stub(quizzThemeService, "create").returns(replacedTheme);

      const result = await quizzThemeService.replaceOne(id, newData);

      expect(result).to.deep.eql([replacedTheme, false]);
    });
  });

  // Description du test : mettre à jour un thème de quiz
  describe("updateOne", function () {
    it("should update a quizz theme", async function () {
      const id = "1";
      const newData = { title: "Updated History" };
      const updatedTheme = { _id: id, ...newData };

      const QuizzThemeMock = sinon.mock(QuizzTheme);
      QuizzThemeMock.expects("findByIdAndUpdate")
        .withArgs(id, newData, { new: true })
        .resolves(updatedTheme);

      const result = await quizzThemeService.updateOne(id, newData);

      expect(result).to.deep.eql(updatedTheme);
      QuizzThemeMock.verify();
    });
  });

  // Description du test : supprimer un thème de quiz
  describe("deleteOne", function () {
    it("should delete a quizz theme by ID", async function () {
      const id = "1";

      const deleteStub = sinon.stub(QuizzTheme, "findByIdAndDelete");
      deleteStub.withArgs(id).resolves(true);

      const result = await quizzThemeService.deleteOne(id);

      expect(result).to.be.true;
      deleteStub.restore();
    });
  });
});
