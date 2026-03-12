import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Replicate schemas from API routes for testing
const ChurnAnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  niveau: z.enum(['faible', 'modere', 'eleve', 'critique']),
  resume: z.string(),
  action_recommandee: z.string(),
  signaux: z.array(z.object({
    signal: z.string(),
    impact: z.number(),
    description: z.string(),
  })),
  probabilite_depart_30j: z.number().min(0).max(100),
});

const UserRoleSchema = z.enum(['admin', 'manager', 'commercial', 'livreur', 'client']);

describe('ChurnAnalysisSchema', () => {
  it('should validate a valid churn analysis', () => {
    const valid = {
      score: 75,
      niveau: 'eleve',
      resume: 'Client à haut risque de churn',
      action_recommandee: 'Appeler dans les 48h avec remise 5%',
      signaux: [
        { signal: 'Dernière commande > 14 jours', impact: 25, description: 'Aucune commande depuis 18 jours' },
      ],
      probabilite_depart_30j: 70,
    };
    expect(() => ChurnAnalysisSchema.parse(valid)).not.toThrow();
  });

  it('should reject score > 100', () => {
    const invalid = {
      score: 101,
      niveau: 'critique',
      resume: 'Test',
      action_recommandee: 'Test',
      signaux: [],
      probabilite_depart_30j: 50,
    };
    expect(() => ChurnAnalysisSchema.parse(invalid)).toThrow();
  });

  it('should reject score < 0', () => {
    const invalid = {
      score: -1,
      niveau: 'faible',
      resume: 'Test',
      action_recommandee: 'Test',
      signaux: [],
      probabilite_depart_30j: 5,
    };
    expect(() => ChurnAnalysisSchema.parse(invalid)).toThrow();
  });

  it('should reject invalid niveau', () => {
    const invalid = {
      score: 50,
      niveau: 'invalid_niveau',
      resume: 'Test',
      action_recommandee: 'Test',
      signaux: [],
      probabilite_depart_30j: 50,
    };
    expect(() => ChurnAnalysisSchema.parse(invalid)).toThrow();
  });
});

describe('UserRoleSchema', () => {
  it('should accept all valid roles', () => {
    expect(() => UserRoleSchema.parse('admin')).not.toThrow();
    expect(() => UserRoleSchema.parse('manager')).not.toThrow();
    expect(() => UserRoleSchema.parse('commercial')).not.toThrow();
    expect(() => UserRoleSchema.parse('livreur')).not.toThrow();
    expect(() => UserRoleSchema.parse('client')).not.toThrow();
  });

  it('should reject invalid roles', () => {
    expect(() => UserRoleSchema.parse('superadmin')).toThrow();
    expect(() => UserRoleSchema.parse('')).toThrow();
    expect(() => UserRoleSchema.parse('root')).toThrow();
  });
});
