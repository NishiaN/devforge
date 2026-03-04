const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

global.S = { genLang: 'ja', files: {}, lang: 'ja', answers: {}, skillLv: 3 };

eval(fs.readFileSync('src/data/presets.js', 'utf-8').replace('const PR', 'var PR'));
eval(fs.readFileSync('src/generators/common.js', 'utf-8').replace(/const /g, 'var '));
eval(fs.readFileSync('src/generators/p24-aisafety.js', 'utf-8'));

const baseAnswers = {
  purpose: 'SaaSアプリを開発する',
  frontend: 'React',
  backend: 'Express',
  database: 'PostgreSQL',
  deploy: 'Railway',
  ai_auto: 'なし',
};

describe('Pillar ㉔ AI Safety Intelligence', () => {

  // ── gen95: AI Safety Framework ──

  describe('gen95 AI Safety Framework', () => {

    test('docs/95 is generated', () => {
      S.files = {};
      S.genLang = 'ja';
      gen95(baseAnswers, 'TestProject');
      assert.ok(S.files['docs/95_ai_safety_framework.md'], 'docs/95 should be generated');
    });

    test('docs/95 is non-empty (>200 chars)', () => {
      S.files = {};
      S.genLang = 'ja';
      gen95(baseAnswers, 'TestProject');
      assert.ok(S.files['docs/95_ai_safety_framework.md'].length > 200, 'docs/95 should be non-empty');
    });

    test('docs/95 contains AI risk category table', () => {
      S.files = {};
      S.genLang = 'ja';
      gen95(baseAnswers, 'TestProject');
      const doc = S.files['docs/95_ai_safety_framework.md'];
      assert.ok(
        doc.includes('AIリスクカテゴリ') || doc.includes('AI Risk Categories'),
        'docs/95 should contain risk category section'
      );
    });

    test('docs/95 contains all 6 risk categories (hallucination, injection, etc.)', () => {
      S.files = {};
      S.genLang = 'ja';
      gen95(baseAnswers, 'TestProject');
      const doc = S.files['docs/95_ai_safety_framework.md'];
      assert.ok(doc.includes('ハルシネーション') || doc.includes('Hallucination'), 'hallucination risk present');
      assert.ok(doc.includes('プロンプトインジェクション') || doc.includes('Prompt Injection'), 'injection risk present');
      assert.ok(doc.includes('🔴 HIGH'), 'HIGH severity present');
    });

    test('docs/95 contains HITL section', () => {
      S.files = {};
      S.genLang = 'ja';
      gen95(baseAnswers, 'TestProject');
      const doc = S.files['docs/95_ai_safety_framework.md'];
      assert.ok(
        doc.includes('Human-in-the-Loop') || doc.includes('ヒューマン・イン・ザ・ループ'),
        'docs/95 should contain HITL section'
      );
    });

    test('docs/95 contains provider config for Claude when ai_auto includes Claude', () => {
      S.files = {};
      S.genLang = 'ja';
      const a = Object.assign({}, baseAnswers, { ai_auto: 'Claude APIを使用' });
      gen95(a, 'TestProject');
      const doc = S.files['docs/95_ai_safety_framework.md'];
      assert.ok(doc.includes('claude') || doc.includes('Claude') || doc.includes('anthropic'), 'Claude provider config present');
    });

    test('docs/95 contains provider config for OpenAI when ai_auto includes GPT', () => {
      S.files = {};
      S.genLang = 'ja';
      const a = Object.assign({}, baseAnswers, { ai_auto: 'OpenAI GPTを使用' });
      gen95(a, 'TestProject');
      const doc = S.files['docs/95_ai_safety_framework.md'];
      assert.ok(doc.includes('GPT') || doc.includes('gpt') || doc.includes('OpenAI'), 'OpenAI provider config present');
    });

    test('docs/95 when no AI: contains "ℹ️" informational note', () => {
      S.files = {};
      S.genLang = 'ja';
      gen95(baseAnswers, 'TestProject');
      const doc = S.files['docs/95_ai_safety_framework.md'];
      assert.ok(doc.includes('ℹ️'), 'docs/95 should show info note when AI not configured');
    });

    test('docs/95 contains compliance table (EU AI Act)', () => {
      S.files = {};
      S.genLang = 'ja';
      gen95(baseAnswers, 'TestProject');
      const doc = S.files['docs/95_ai_safety_framework.md'];
      assert.ok(doc.includes('EU AI Act'), 'docs/95 should reference EU AI Act');
    });

    test('docs/95 EN genLang produces English content', () => {
      S.files = {};
      S.genLang = 'en';
      gen95(baseAnswers, 'TestProject');
      const doc = S.files['docs/95_ai_safety_framework.md'];
      assert.ok(doc.includes('AI Safety Framework'), 'EN output should contain English title');
      assert.ok(doc.includes('Human-in-the-Loop'), 'EN output should contain English HITL section');
    });

  });

  // ── gen96: AI Guardrail Implementation ──

  describe('gen96 Guardrail Implementation', () => {

    test('docs/96 is generated and non-empty', () => {
      S.files = {};
      S.genLang = 'ja';
      gen96(baseAnswers, 'TestProject');
      assert.ok(S.files['docs/96_ai_guardrail_implementation.md'], 'docs/96 should be generated');
      assert.ok(S.files['docs/96_ai_guardrail_implementation.md'].length > 200, 'docs/96 should be non-empty');
    });

    test('docs/96 contains all 4 guardrail layers', () => {
      S.files = {};
      S.genLang = 'ja';
      gen96(baseAnswers, 'TestProject');
      const doc = S.files['docs/96_ai_guardrail_implementation.md'];
      assert.ok(doc.includes('Layer 1'), 'Layer 1 present');
      assert.ok(doc.includes('Layer 2'), 'Layer 2 present');
      assert.ok(doc.includes('Layer 3'), 'Layer 3 present');
      assert.ok(doc.includes('Layer 4'), 'Layer 4 present');
    });

    test('docs/96 contains input sanitization code', () => {
      S.files = {};
      S.genLang = 'ja';
      gen96(baseAnswers, 'TestProject');
      const doc = S.files['docs/96_ai_guardrail_implementation.md'];
      assert.ok(doc.includes('sanitizeUserInput'), 'docs/96 should contain sanitizeUserInput function');
    });

    test('docs/96 contains PII detection code', () => {
      S.files = {};
      S.genLang = 'ja';
      gen96(baseAnswers, 'TestProject');
      const doc = S.files['docs/96_ai_guardrail_implementation.md'];
      assert.ok(doc.includes('detectPII'), 'docs/96 should contain detectPII function');
    });

    test('docs/96 contains rate limiting code', () => {
      S.files = {};
      S.genLang = 'ja';
      gen96(baseAnswers, 'TestProject');
      const doc = S.files['docs/96_ai_guardrail_implementation.md'];
      assert.ok(
        doc.includes('ratelimit') || doc.includes('Ratelimit') || doc.includes('rate_limit'),
        'docs/96 should contain rate limit implementation'
      );
    });

    test('docs/96 contains output validation code', () => {
      S.files = {};
      S.genLang = 'ja';
      gen96(baseAnswers, 'TestProject');
      const doc = S.files['docs/96_ai_guardrail_implementation.md'];
      assert.ok(doc.includes('validateAIOutput') || doc.includes('validate'), 'docs/96 should contain output validation');
    });

  });

  // ── gen97: AI Model Evaluation ──

  describe('gen97 Model Evaluation Strategy', () => {

    test('docs/97 is generated and non-empty', () => {
      S.files = {};
      S.genLang = 'ja';
      gen97(baseAnswers, 'TestProject');
      assert.ok(S.files['docs/97_ai_model_evaluation.md'], 'docs/97 should be generated');
      assert.ok(S.files['docs/97_ai_model_evaluation.md'].length > 200, 'docs/97 should be non-empty');
    });

    test('docs/97 contains evaluation metrics table', () => {
      S.files = {};
      S.genLang = 'ja';
      gen97(baseAnswers, 'TestProject');
      const doc = S.files['docs/97_ai_model_evaluation.md'];
      assert.ok(
        doc.includes('評価メトリクス') || doc.includes('Evaluation Metrics'),
        'docs/97 should contain metrics section'
      );
    });

    test('docs/97 contains key metrics (Accuracy, Hallucination Rate)', () => {
      S.files = {};
      S.genLang = 'ja';
      gen97(baseAnswers, 'TestProject');
      const doc = S.files['docs/97_ai_model_evaluation.md'];
      assert.ok(doc.includes('Accuracy'), 'docs/97 should reference Accuracy metric');
      assert.ok(doc.includes('Hallucination Rate'), 'docs/97 should reference Hallucination Rate');
    });

    test('docs/97 contains mermaid evaluation pipeline', () => {
      S.files = {};
      S.genLang = 'ja';
      gen97(baseAnswers, 'TestProject');
      const doc = S.files['docs/97_ai_model_evaluation.md'];
      assert.ok(doc.includes('```mermaid'), 'docs/97 should contain mermaid diagram');
    });

    test('docs/97 contains RAGAS hallucination evaluation', () => {
      S.files = {};
      S.genLang = 'ja';
      gen97(baseAnswers, 'TestProject');
      const doc = S.files['docs/97_ai_model_evaluation.md'];
      assert.ok(doc.includes('RAGAS') || doc.includes('ragas'), 'docs/97 should contain RAGAS evaluation');
    });

    test('docs/97 contains A/B test design table', () => {
      S.files = {};
      S.genLang = 'ja';
      gen97(baseAnswers, 'TestProject');
      const doc = S.files['docs/97_ai_model_evaluation.md'];
      assert.ok(
        doc.includes('A/Bテスト') || doc.includes('A/B Test'),
        'docs/97 should contain A/B test design'
      );
    });

  });

  // ── gen98: Prompt Injection Defense ──

  describe('gen98 Prompt Injection Defense', () => {

    test('docs/98 is generated and non-empty', () => {
      S.files = {};
      S.genLang = 'ja';
      gen98(baseAnswers, 'TestProject');
      assert.ok(S.files['docs/98_prompt_injection_defense.md'], 'docs/98 should be generated');
      assert.ok(S.files['docs/98_prompt_injection_defense.md'].length > 200, 'docs/98 should be non-empty');
    });

    test('docs/98 contains attack patterns (Direct/Indirect Injection)', () => {
      S.files = {};
      S.genLang = 'ja';
      gen98(baseAnswers, 'TestProject');
      const doc = S.files['docs/98_prompt_injection_defense.md'];
      assert.ok(doc.includes('Direct Injection'), 'docs/98 should contain Direct Injection pattern');
      assert.ok(doc.includes('Indirect Injection'), 'docs/98 should contain Indirect Injection pattern');
    });

    test('docs/98 contains defense implementation patterns', () => {
      S.files = {};
      S.genLang = 'ja';
      gen98(baseAnswers, 'TestProject');
      const doc = S.files['docs/98_prompt_injection_defense.md'];
      assert.ok(
        doc.includes('sanitizePrompt') || doc.includes('sanitize'),
        'docs/98 should contain input sanitization defense'
      );
    });

    test('docs/98 contains defense checklist', () => {
      S.files = {};
      S.genLang = 'ja';
      gen98(baseAnswers, 'TestProject');
      const doc = S.files['docs/98_prompt_injection_defense.md'];
      assert.ok(
        doc.includes('防御チェックリスト') || doc.includes('Defense Checklist'),
        'docs/98 should contain defense checklist'
      );
    });

    test('docs/98 contains mermaid privilege separation diagram', () => {
      S.files = {};
      S.genLang = 'ja';
      gen98(baseAnswers, 'TestProject');
      const doc = S.files['docs/98_prompt_injection_defense.md'];
      assert.ok(doc.includes('```mermaid'), 'docs/98 should contain mermaid diagram');
    });

    test('docs/98 contains incident response procedure', () => {
      S.files = {};
      S.genLang = 'ja';
      gen98(baseAnswers, 'TestProject');
      const doc = S.files['docs/98_prompt_injection_defense.md'];
      assert.ok(
        doc.includes('インシデント対応') || doc.includes('Incident Response'),
        'docs/98 should contain incident response section'
      );
    });

    test('docs/98 EN genLang produces English content', () => {
      S.files = {};
      S.genLang = 'en';
      gen98(baseAnswers, 'TestProject');
      const doc = S.files['docs/98_prompt_injection_defense.md'];
      assert.ok(doc.includes('Prompt Injection Defense'), 'EN output should contain English title');
      assert.ok(doc.includes('Defense Checklist'), 'EN output should contain English checklist header');
    });

  });

  // ── gen98_2: XAI Transparency (AI有効時のみ) ──

  describe('gen98_2 XAI Transparency (AI-enabled only)', () => {

    test('docs/98-2 is generated when ai_auto is enabled', () => {
      S.files = {};
      S.genLang = 'ja';
      const a = Object.assign({}, baseAnswers, { ai_auto: 'RAG + ベクターDB' });
      genPillar24_AISafety(a, 'TestProject');
      assert.ok(S.files['docs/98-2_xai_transparency_guide.md'], 'docs/98-2 should be generated when AI is enabled');
    });

    test('docs/98-2 is NOT generated when ai_auto is "なし"', () => {
      S.files = {};
      S.genLang = 'ja';
      genPillar24_AISafety(baseAnswers, 'TestProject');
      assert.ok(!S.files['docs/98-2_xai_transparency_guide.md'], 'docs/98-2 should NOT be generated when AI is disabled');
    });

    test('docs/98-2 is NOT generated when ai_auto is empty string', () => {
      S.files = {};
      S.genLang = 'ja';
      const a = Object.assign({}, baseAnswers, { ai_auto: '' });
      genPillar24_AISafety(a, 'TestProject');
      assert.ok(!S.files['docs/98-2_xai_transparency_guide.md'], 'docs/98-2 should NOT be generated when ai_auto is empty');
    });

    test('docs/98-2 contains XAI technique selection matrix', () => {
      S.files = {};
      S.genLang = 'ja';
      const a = Object.assign({}, baseAnswers, { ai_auto: 'シングルAgent自動化' });
      gen98_2(a, 'TestProject');
      const doc = S.files['docs/98-2_xai_transparency_guide.md'];
      assert.ok(
        doc.includes('XAI技法選定マトリクス') || doc.includes('XAI Technique Selection Matrix'),
        'docs/98-2 should contain XAI technique matrix'
      );
    });

    test('docs/98-2 contains SHAP in technique matrix', () => {
      S.files = {};
      S.genLang = 'ja';
      const a = Object.assign({}, baseAnswers, { ai_auto: 'シングルAgent自動化' });
      gen98_2(a, 'TestProject');
      const doc = S.files['docs/98-2_xai_transparency_guide.md'];
      assert.ok(doc.includes('SHAP'), 'docs/98-2 should list SHAP technique');
    });

    test('docs/98-2 health domain: contains high-risk warning', () => {
      S.files = {};
      S.genLang = 'ja';
      const a = Object.assign({}, baseAnswers, {
        purpose: '医療診断支援AIシステム',
        ai_auto: 'RAG + ベクターDB',
      });
      gen98_2(a, 'TestProject');
      const doc = S.files['docs/98-2_xai_transparency_guide.md'];
      assert.ok(
        doc.includes('高リスクドメイン') || doc.includes('High-risk domain'),
        'docs/98-2 should warn about high-risk domain for health'
      );
    });

    test('docs/98-2 fintech domain: contains fintech XAI recommendation', () => {
      S.files = {};
      S.genLang = 'ja';
      const a = Object.assign({}, baseAnswers, {
        purpose: 'フィンテック信用スコア評価サービス',
        ai_auto: 'シングルAgent自動化',
      });
      gen98_2(a, 'TestProject');
      const doc = S.files['docs/98-2_xai_transparency_guide.md'];
      assert.ok(
        doc.includes('Feature Importance') || doc.includes('Counterfactual'),
        'docs/98-2 should contain fintech-specific XAI recommendation'
      );
    });

    test('docs/98-2 contains Model Card template', () => {
      S.files = {};
      S.genLang = 'ja';
      const a = Object.assign({}, baseAnswers, { ai_auto: 'RAG + ベクターDB' });
      gen98_2(a, 'TestProject');
      const doc = S.files['docs/98-2_xai_transparency_guide.md'];
      assert.ok(
        doc.includes('Model Card') || doc.includes('Model Overview'),
        'docs/98-2 should contain Model Card template'
      );
    });

    test('docs/98-2 contains EU AI Act transparency checklist', () => {
      S.files = {};
      S.genLang = 'ja';
      const a = Object.assign({}, baseAnswers, { ai_auto: 'RAG + ベクターDB' });
      gen98_2(a, 'TestProject');
      const doc = S.files['docs/98-2_xai_transparency_guide.md'];
      assert.ok(doc.includes('EU AI Act'), 'docs/98-2 should reference EU AI Act');
    });

  });

  // ── genPillar24 orchestration ──

  describe('genPillar24 orchestration', () => {

    test('all 4 core docs are generated (no AI)', () => {
      S.files = {};
      S.genLang = 'ja';
      genPillar24_AISafety(baseAnswers, 'TestProject');
      assert.ok(S.files['docs/95_ai_safety_framework.md'], 'docs/95 missing');
      assert.ok(S.files['docs/96_ai_guardrail_implementation.md'], 'docs/96 missing');
      assert.ok(S.files['docs/97_ai_model_evaluation.md'], 'docs/97 missing');
      assert.ok(S.files['docs/98_prompt_injection_defense.md'], 'docs/98 missing');
    });

    test('no undefined strings in any generated docs', () => {
      S.files = {};
      S.genLang = 'ja';
      const a = Object.assign({}, baseAnswers, { ai_auto: 'RAG + ベクターDB' });
      genPillar24_AISafety(a, 'TestProject');
      const keys = [
        'docs/95_ai_safety_framework.md',
        'docs/96_ai_guardrail_implementation.md',
        'docs/97_ai_model_evaluation.md',
        'docs/98_prompt_injection_defense.md',
        'docs/98-2_xai_transparency_guide.md',
      ];
      keys.forEach(function(k) {
        const doc = S.files[k] || '';
        assert.ok(!doc.includes('undefined'), k + ' should not contain "undefined"');
      });
    });

  });

});
