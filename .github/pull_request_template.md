## Description
<!-- Décris les changements apportés -->

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Refactoring
- [ ] Tests
- [ ] Documentation

## Checklist
- [ ] `npm run build` passe sans erreur
- [ ] `npx tsc --noEmit` → zéro erreur TypeScript
- [ ] `npm test` → tous les tests passent
- [ ] Zéro `any` TypeScript introduit
- [ ] Zéro `console.log` en production
- [ ] Firestore Security Rules mises à jour si nouvelle collection
- [ ] Variables d'env documentées dans .env.example si nouvelles
- [ ] Error boundary en place si nouvelle feature critique
