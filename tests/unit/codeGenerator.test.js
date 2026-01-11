const generateCode = require('../../src/utils/codeGenerator');

describe('Code Generator Utility', () => {
    test('should generate a code of exactly 6 characters', () => {
        const code = generateCode();
        expect(code).toHaveLength(6);
    });

    test('should generate a code containing only uppercase alphanumeric characters', () => {
        const code = generateCode();
        expect(code).toMatch(/^[A-Z0-9]+$/);
    });

    test('should generate unique codes (probabilistic check)', () => {
        // Generate two codes and ensure they are different
        // With 36^6 combinations (~2 billion), collision probability is extremely low
        const code1 = generateCode();
        const code2 = generateCode();
        expect(code1).not.toBe(code2);
    });

    test('should return a string', () => {
        const code = generateCode();
        expect(typeof code).toBe('string');
    });
});
