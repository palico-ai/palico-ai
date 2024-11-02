/**
 * Source code copied over from npm rouge package as the npm version was not working
 * ref: https://github.com/kenlimmj/rouge/tree/master
 */

import * as utils from './utils';

/* Computes the ROUGE-N score for a candidate summary.
 *
 * Configuration object schema and defaults:
 * ```
 * {
 * 	n: 1                            // The size of the ngram used
 * 	nGram: <inbuilt function>,      // The ngram generator function
 * 	tokenizer: <inbuilt function>   // The string tokenizer
 * }
 * ```
 *
 * `nGram` has a type signature of ((Array<string>, number) => Array<string>)
 * `tokenizer` has a type signature of ((string) => Array<string)
 *
 * @method n
 * @param  {string}     cand        The candidate summary to be evaluated
 * @param  {string}     ref         The reference summary to be evaluated against
 * @param  {Object}     opts        Configuration options (see example)
 * @return {number}                 The ROUGE-N score
 */
function n(actual: string, expected: string): number {
  if (actual.length === 0)
    throw new RangeError('Candidate cannot be an empty string');
  if (expected.length === 0)
    throw new RangeError('Reference cannot be an empty string');

  // Merge user-provided configuration with defaults
  const opts = {
    n: 1,
    nGram: utils.nGram,
    tokenizer: utils.treeBankTokenize,
  };

  const candGrams = opts.nGram(opts.tokenizer(actual), opts.n);
  const refGrams = opts.nGram(opts.tokenizer(expected), opts.n);

  const match = utils.intersection(candGrams, refGrams);
  return match.length / refGrams.length;
}

/**
 * Computes the ROUGE-S score for a candidate summary.
 *
 * Configuration object schema and defaults:
 * ```
 * {
 * 	beta: 1                             // The beta value used for the f-measure
 * 	gapLength: 2                        // The skip window
 * 	skipBigram: <inbuilt function>,     // The skip-bigram generator function
 * 	tokenizer: <inbuilt function>       // The string tokenizer
 * }
 * ```
 *
 * `skipBigram` has a type signature of ((Array<string>, number) => Array<string>)
 * `tokenizer` has a type signature of ((string) => Array<string)
 *
 * @method s
 * @param  {string}     actual        The candidate summary to be evaluated
 * @param  {string}     expected         The reference summary to be evaluated against
 * @param  {Object}     opts        Configuration options (see example)
 * @return {number}                 The ROUGE-S score
 */
function s(actual: string, expected: string): number {
  if (actual.length === 0)
    throw new RangeError('Candidate cannot be an empty string');
  if (expected.length === 0)
    throw new RangeError('Reference cannot be an empty string');

  // Merge user-provided configuration with defaults
  const opts = {
    beta: 0.5,
    skipBigram: utils.skipBigram,
    tokenizer: utils.treeBankTokenize,
  };

  const candGrams = opts.skipBigram(opts.tokenizer(actual));
  const refGrams = opts.skipBigram(opts.tokenizer(expected));

  const skip2 = utils.intersection(candGrams, refGrams).length;

  if (skip2 === 0) {
    return 0;
  } else {
    const skip2Recall = skip2 / refGrams.length;
    const skip2Prec = skip2 / candGrams.length;

    return utils.fMeasure(skip2Prec, skip2Recall, opts.beta);
  }
}

/**
 * Computes the ROUGE-L score for a candidate summary
 *
 * Configuration object schema and defaults:
 * ```
 * {
 * 	beta: 1                             // The beta value used for the f-measure
 * 	lcs: <inbuilt function>             // The least common subsequence function
 * 	segmenter: <inbuilt function>,      // The sentence segmenter
 * 	tokenizer: <inbuilt function>       // The string tokenizer
 * }
 * ```
 *
 * `lcs` has a type signature of ((Array<string>, Array<string>) => Array<string>)
 * `segmenter` has a type signature of ((string) => Array<string)
 * `tokenizer` has a type signature of ((string) => Array<string)
 *
 * @method l
 * @param  {string}     actual        The candidate summary to be evaluated
 * @param  {string}     expected         The reference summary to be evaluated against
 * @return {number}                 The ROUGE-L score
 */
function l(actual: string, expected: string): number {
  if (actual.length === 0)
    throw new RangeError('Candidate cannot be an empty string');
  if (expected.length === 0)
    throw new RangeError('Reference cannot be an empty string');

  // Merge user-provided configuration with defaults
  const opts = {
    beta: 0.5,
    lcs: utils.lcs,
    segmenter: utils.sentenceSegment,
    tokenizer: utils.treeBankTokenize,
  };

  const candSents = opts.segmenter(actual);
  const refSents = opts.segmenter(expected);

  const candWords = opts.tokenizer(actual);
  const refWords = opts.tokenizer(expected);

  const lcsAcc = refSents.map((r) => {
    const rTokens = opts.tokenizer(r);
    const lcsUnion = new Set(
      ...candSents.map((c) => opts.lcs(opts.tokenizer(c), rTokens))
    );

    return lcsUnion.size;
  });

  // Sum the array as quickly as we can
  let lcsSum = 0;
  while (lcsAcc.length) {
    const value = lcsAcc.pop();
    if (value !== undefined) lcsSum += value;
  }

  const lcsRecall = lcsSum / candWords.length;
  const lcsPrec = lcsSum / refWords.length;

  return utils.fMeasure(lcsPrec, lcsRecall, opts.beta);
}

const rouge = {
  n,
  s,
  l,
};

export default rouge;
