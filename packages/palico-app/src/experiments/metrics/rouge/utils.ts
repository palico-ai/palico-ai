/* eslint-disable */

import {
  GATE_SUBSTITUTIONS,
  GATE_EXCEPTIONS,
  TREEBANK_CONTRACTIONS,
} from './constants';

/**
 * Splits a sentence into an array of word tokens
 * in accordance with the Penn Treebank guidelines.
 *
 * NOTE: This method assumes that the input is a single
 * sentence only. Providing multiple sentences within a
 * single string can trigger edge cases which have not
 * been accounted for.
 *
 * Adapted from Titus Wormer's port of the Penn Treebank Tokenizer
 * found at https://gist.github.com/wooorm/8504606
 *
 *
 * @method treeBankTokenize
 * @param  {string}           input     The sentence to be tokenized
 * @return {Array<string>}              An array of word tokens
 */
export function treeBankTokenize(input: string): Array<string> {
  if (input.length === 0) return [];

  // Does the following things in order of appearance by line:
  // 1. Replace quotes at the sentence start position with double ticks
  // 2. Wrap spaces around a double quote preceded by opening brackets
  // 3. Wrap spaces around a non-unicode ellipsis
  // 4. Wrap spaces around some punctuation signs (,;@#$%&)
  // 5. Wrap spaces around a period and zero or more closing brackets
  //    (or quotes), when not preceded by a period and when followed
  //    by the end of the string. Only splits final periods because
  //    sentence tokenization is assumed as a preprocessing step
  // 6. Wrap spaces around all exclamation marks and question marks
  // 7. Wrap spaces around opening and closing brackets
  // 8. Wrap spaces around en and em-dashes
  let parse = input
    .replace(/^\"/, ' `` ')
    .replace(/([ (\[{<])"/g, '$1 `` ')
    .replace(/\.\.\.*/g, ' ... ')
    .replace(/[;@#$%&]/g, ' $& ')
    .replace(/([^\.])(\.)([\]\)}>"\']*)\s*$/g, '$1 $2$3 ')
    .replace(/[,?!]/g, ' $& ')
    .replace(/[\]\[\(\)\{\}<>]/g, ' $& ')
    .replace(/---*/g, ' -- ');

  // Wrap spaces at the start and end of the sentence for consistency
  // i.e. reduce the number of Regex matches required
  parse = ` ${parse} `;

  // Does the following things in order of appearance by line:
  // 1. Replace double quotes with a pair of single quotes wrapped with spaces
  // 2. Wrap possessive or closing single quotes
  // 3. Add a space before single quotes followed by `s`, `m`, or `d` and a space
  // 4. Add a space before occurrences of `'ll`, `'re`, `'ve` or `n't`
  parse = parse
    .replace(/"/g, " '' ")
    .replace(/([^'])' /g, "$1 ' ")
    .replace(/'([sSmMdD]) /g, " '$1 ")
    .replace(/('ll|'LL|'re|'RE|'ve|'VE|n't|N'T) /g, ' $1 ');

  let iterator = -1;
  while (iterator++ < TREEBANK_CONTRACTIONS.length) {
    // Break uncommon contractions with a space and wrap-in spaces
    parse = parse.replace(TREEBANK_CONTRACTIONS[iterator], ' $1 $2 ');
  }

  // Concatenate double spaces and remove start/end spaces
  parse = parse.replace(/\ \ +/g, ' ').replace(/^\ |\ $/g, '');

  // Split on spaces (original and inserted) to return the tokenized result
  return parse.split(' ');
}

/**
 * Splits a body of text into an array of sentences
 * using a rule-based segmentation approach.
 *
 * Adapted from Spencer Mountain's nlp_compromise library
 * found at https://github.com/spencermountain/nlp_compromise/
 *
 * @method sentenceSegment
 * @param  {string}         input     The document to be segmented
 * @return {Array<string>}            An array of sentences
 */
export function sentenceSegment(input: string): Array<string> {
  if (input.length === 0) return [];

  const abbrvReg = new RegExp(
    '\\b(' + GATE_SUBSTITUTIONS.join('|') + ')[.!?] ?$',
    'i'
  );
  const acronymReg = new RegExp(/[ |.][A-Z].?$/, 'i');
  const breakReg = new RegExp(/[\r\n]+/, 'g');
  const ellipseReg = new RegExp(/\.\.\.*$/);
  const excepReg = new RegExp(
    '\\b(' + GATE_EXCEPTIONS.join('|') + ')[.!?] ?$',
    'i'
  );

  // Split sentences naively based on common terminals (.?!")
  const chunks = input.split(/(\S.+?[.?!])(?=\s+|$|")/g);

  const acc = [];
  for (let idx = 0; idx < chunks.length; idx++) {
    if (chunks[idx]) {
      // Trim only whitespace (i.e. preserve line breaks/carriage feeds)
      chunks[idx] = chunks[idx].replace(/(^ +| +$)/g, '');

      if (breakReg.test(chunks[idx])) {
        if (chunks[idx + 1] && strIsTitleCase(chunks[idx])) {
          // Catch line breaks embedded within valid sentences
          // i.e. sentences that start with a capital letter
          // and merge them with a delimiting space
          chunks[idx + 1] =
            (chunks[idx].trim() || '') +
            ' ' +
            (chunks[idx + 1] || '').replace(/ +/g, ' ');
        } else {
          // Assume that all other embedded line breaks are
          // valid sentence breakpoints
          acc.push(...chunks[idx].trim().split('\n'));
        }
      } else if (chunks[idx + 1] && abbrvReg.test(chunks[idx])) {
        const nextChunk = chunks[idx + 1];
        if (
          nextChunk.trim() &&
          strIsTitleCase(nextChunk) &&
          !excepReg.test(chunks[idx])
        ) {
          // Catch abbreviations followed by a capital letter and treat as a boundary.
          // FIXME: This causes named entities like `Mt. Fuji` or `U.S. Government` to fail.
          acc.push(chunks[idx]);
          chunks[idx] = '';
        } else {
          // Catch common abbreviations and merge them with a delimiting space
          chunks[idx + 1] =
            (chunks[idx] || '') + ' ' + (nextChunk || '').replace(/ +/g, ' ');
        }
      } else if (
        chunks[idx].length > 1 &&
        chunks[idx + 1] &&
        acronymReg.test(chunks[idx])
      ) {
        const words = chunks[idx].split(' ');
        const lastWord = words[words.length - 1];

        if (lastWord === lastWord.toLowerCase()) {
          // Catch small-letter abbreviations and merge them.
          chunks[idx + 1] = chunks[idx + 1] =
            (chunks[idx] || '') +
            ' ' +
            (chunks[idx + 1] || '').replace(/ +/g, ' ');
        } else if (chunks[idx + 2]) {
          if (
            strIsTitleCase(words[words.length - 2]) &&
            strIsTitleCase(chunks[idx + 2])
          ) {
            // Catch name abbreviations (e.g. Albert I. Jones) by checking if
            // the previous and next words are all capitalized.
            chunks[idx + 2] =
              (chunks[idx] || '') +
              (chunks[idx + 1] || '').replace(/ +/g, ' ') +
              (chunks[idx + 2] || '');
          } else {
            // Assume that remaining entities are indeed end-of-sentence markers.
            acc.push(chunks[idx]);
            chunks[idx] = '';
          }
        }
      } else if (chunks[idx + 1] && ellipseReg.test(chunks[idx])) {
        // Catch mid-sentence ellipses (and their derivatives) and merge them
        chunks[idx + 1] =
          (chunks[idx] || '') + (chunks[idx + 1] || '').replace(/ +/g, ' ');
      } else if (chunks[idx] && chunks[idx].length > 0) {
        acc.push(chunks[idx]);
        chunks[idx] = '';
      }
    }
  }

  // If no matches were found, return the input treated as a single sentence
  return acc.length === 0 ? [input] : acc;
}

/**
 * Checks if a string is titlecase
 * @method strIsTitleCase
 * @param  {string}   input       The string to be checked
 * @return {boolean}              True if the string is titlecase and false otherwise
 */
export function strIsTitleCase(input: string): boolean {
  const firstChar = input.trim().slice(0, 1);
  return charIsUpperCase(firstChar);
}

/**
 * Checks if a character is uppercase
 * @method charIsUpperCase
 * @param  {string}   input     The character to be tested
 * @return {boolean}            True if the character is uppercase and false otherwise.
 */
export function charIsUpperCase(input: string): boolean {
  if (input.length !== 1)
    throw new RangeError('Input should be a single character');

  const char = input.charCodeAt(0);
  return char >= 65 && char <= 90;
}

/**
 * Computes the factorial of a number.
 *
 * This function uses a tail-recursive call to avoid
 * blowing the stack when computing inputs with a large
 * recursion depth.
 *
 * If this function will be called repeatedly within
 * the same scope, it is highly recommended that the
 * user memoize the function (e.g. lodash.memoize).
 *
 * @method factRec
 * @param  {number} x     The number for which the factorial is to be computed
 * @param  {number} acc   The starting value for the computation. Defaults to 1.
 * @return {number}       The factorial result
 */
function factRec(x: number, acc = 1): number {
  if (x < 0) throw RangeError('Input must be a positive number');
  return x < 2 ? acc : factRec(x - 1, x * acc);
}

/**
 * Returns the skip bigrams for an array of word tokens.
 *
 * @method skipBigram
 * @param  {Array<string>}    tokens      An array of word tokens
 * @return {Array<string>}                An array of skip bigram strings
 */
export function skipBigram(tokens: Array<string>): Array<string> {
  if (tokens.length < 2)
    throw new RangeError('Input must have at least two words');

  const acc = [];
  for (let baseIdx = 0; baseIdx < tokens.length - 1; baseIdx++) {
    for (let sweepIdx = baseIdx + 1; sweepIdx < tokens.length; sweepIdx++) {
      acc.push(`${tokens[baseIdx]} ${tokens[sweepIdx]}`);
    }
  }

  return acc;
}

export const NGRAM_DEFAULT_OPTS = { start: false, end: false, val: '<S>' };

/**
 * Returns n-grams for an array of word tokens.
 *
 * @method nGram
 * @param  {Array<string>}          tokens    An array of word tokens
 * @param  {number}                 n         The size of the n-gram. Defaults to 2.
 * @param  {Object}                 pad       String padding options. See example.
 * @return {Array<string>}                    An array of n-gram strings
 */
export function nGram(
  tokens: Array<string>,
  n = 2,
  pad: Object = {}
): Array<string> {
  if (n < 1) throw new RangeError('ngram size cannot be smaller than 1');

  if (tokens.length < n) {
    throw new RangeError(
      'ngram size cannot be larger than the number of tokens available'
    );
  }

  if (Object.keys(pad).length !== 0) {
    const config = Object.assign({}, NGRAM_DEFAULT_OPTS, pad);

    // Clone the input token array to avoid mutating the source data
    const tempTokens = tokens.slice(0);

    if (config.start)
      for (let i = 0; i < n - 1; i++) tempTokens.unshift(config.val);
    if (config.end) for (let i = 0; i < n - 1; i++) tempTokens.push(config.val);

    tokens = tempTokens;
  }

  const acc = [];
  for (let idx = 0; idx < tokens.length - n + 1; idx++) {
    acc.push(tokens.slice(idx, idx + n).join(' '));
  }

  return acc;
}

/**
 * Calculates C(val, 2), i.e. the number of ways 2
 * items can be chosen from `val` items.
 *
 * @method comb2
 * @param  {number} val     The total number of items to choose from
 * @return {number}         The number of ways in which 2 items can be chosen from `val`
 */
export function comb2(val: number): number {
  if (val < 2) throw new RangeError('Input must be greater than 2');
  return 0.5 * val * (val - 1);
}

/**
 * Computes the arithmetic mean of an array
 * @method arithmeticMean
 * @param  {Array<number>}   input    Data distribution
 * @return {number}                   The mean of the distribution
 */
export function arithmeticMean(input: Array<number>): number {
  if (input.length < 1)
    throw new RangeError('Input array must have at least 1 element');
  return input.reduce((x, y) => x + y) / input.length;
}

/**
 * Evaluates the jackknife resampling result for a set of
 * candidate summaries vs. a reference summary.
 *
 * @method jackKnife
 * @param  {Array<string>}  cands      An array of candidate summaries to be evaluated
 * @param  {string}         ref        The reference summary to be evealuated against
 * @param  {Function}       func       The function used to evaluate a candidate against a reference.
 *                                     Should be of the type signature (string, string) => number
 * @param  {Function}       test       The function used to compute the test statistic.
 *                                     Defaults to the arithmetic mean.
 *                                     Should be of the type signature (Array<number>) => number
 * @return {number}                    The result computed by applying `test` to the resampled data
 */
export function jackKnife(
  cands: Array<string>,
  ref: string,
  func: (x: string, y: string) => number,
  test: (x: Array<number>) => number = arithmeticMean
): number {
  if (cands.length < 2) {
    throw new RangeError('Candidate array must contain more than one element');
  }

  const pairs = cands.map((c) => func(c, ref));

  const acc = [];
  for (let idx = 0; idx < pairs.length; idx++) {
    // Clone the array and remove one element
    const leaveOneOut = pairs.slice(0);
    leaveOneOut.splice(idx, 1);

    acc.push(Math.max(...leaveOneOut));
  }

  return test(acc);
}

/**
 * Calculates the ROUGE f-measure for a given precision
 * and recall score.
 *
 * DUC evaluation favors precision by setting beta to an
 * arbitary large number. To replicate this, set beta to
 * any value larger than 1.
 *
 * @method fMeasure
 * @param  {number}     p       Precision score
 * @param  {number}     r       Recall score
 * @param  {number}     beta    Weighing value (precision vs. recall).
 *                              Defaults to 0.5, i.e. mean f-score
 * @return {number}             Computed f-score
 */
export function fMeasure(p: number, r: number, beta = 0.5): number {
  if (p < 0 || p > 1)
    throw new RangeError('Precision value p must have bounds 0 ≤ p ≤ 1');
  if (r < 0 || r > 1)
    throw new RangeError('Recall value r must have bounds 0 ≤ r ≤ 1');

  if (beta < 0) {
    throw new RangeError('beta value must be greater than 0');
  } else if (0 <= beta && beta <= 1) {
    return ((1 + beta * beta) * r * p) / (r + beta * beta * p);
  } else {
    return r;
  }
}

/**
 * Computes the set intersection of two arrays
 *
 * @method intersection
 * @param  {Array<string>}    a     The first array
 * @param  {Array<string>}    b     The second array
 * @return {Array<string>}          Elements common to both the first and second array
 */
export function intersection(
  a: Array<string>,
  b: Array<string>
): Array<string> {
  const test = new Set(a);
  const ref = new Set(b);

  return Array.from(test).filter((elem) => ref.has(elem));
}

/**
 * Computes the longest common subsequence for two arrays.
 * This function returns the elements from the two arrays
 * that form the LCS, in order of their appearance.
 *
 * For speed, the search-space is prunned by eliminating
 * common entities at the start and end of both input arrays.
 *
 * @method lcs
 * @param  {Array<string>}    a     The first array
 * @param  {Array<string>}    b     The second array
 * @return {Array<string>}          The longest common subsequence between the first and second array
 */
export function lcs(a: Array<string>, b: Array<string>): Array<string> {
  if (a.length === 0 || b.length === 0) return [];

  const start = [];
  const end = [];

  let startIdx = 0;
  let aEndIdx = a.length - 1;
  let bEndIdx = b.length - 1;

  while (a[startIdx] && b[startIdx] && a[startIdx] === b[startIdx]) {
    start.push(a[startIdx]);
    startIdx++;
  }

  while (a[aEndIdx] && b[bEndIdx] && a[aEndIdx] === b[bEndIdx]) {
    end.push(a[aEndIdx]);
    aEndIdx--;
    bEndIdx--;
  }

  const trimmedA = a.slice(startIdx, aEndIdx + 1);
  const trimmedB = b.slice(startIdx, bEndIdx + 1);

  for (let bIdx = 0; bIdx < trimmedB.length; bIdx++) {
    for (let aIdx = 0; aIdx < trimmedA.length; aIdx++) {
      if (trimmedB[bIdx] === trimmedA[aIdx]) start.push(trimmedA[aIdx]);
    }
  }

  return start.concat(end);
}
