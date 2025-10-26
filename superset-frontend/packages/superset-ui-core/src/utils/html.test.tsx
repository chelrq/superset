/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import {
  sanitizeHtml,
  isProbablyHTML,
  sanitizeHtmlIfNeeded,
  safeHtmlSpan,
  removeHTMLTags,
  isJsonString,
  getParagraphContents,
} from './html';

describe('sanitizeHtml', () => {
  test('should sanitize the HTML string', () => {
    const htmlString = '<script>alert("XSS")</script>';
    const sanitizedString = sanitizeHtml(htmlString);
    expect(sanitizedString).not.toContain('script');
  });

  test('should sanitize common XSS attack vectors', () => {
    // Script tag injection
    expect(sanitizeHtml('<script>alert(1)</script>')).not.toContain('script');

    // Event handler injection
    const onclickAttack = '<div onclick="alert(1)">click me</div>';
    expect(sanitizeHtml(onclickAttack)).not.toContain('onclick');

    // JavaScript protocol
    const jsProtocol = '<a href="javascript:alert(1)">link</a>';
    expect(sanitizeHtml(jsProtocol)).not.toContain('javascript:');

    // Iframe injection
    const iframeAttack = '<iframe src="evil.com"></iframe>';
    const sanitized = sanitizeHtml(iframeAttack);
    expect(sanitized).not.toContain('iframe');

    // IMG onerror
    const imgAttack = '<img src=x onerror="alert(1)">';
    expect(sanitizeHtml(imgAttack)).not.toContain('onerror');
  });
});

describe('isProbablyHTML', () => {
  test('should return true if the text contains HTML tags', () => {
    const htmlText = '<div>Some HTML content</div>';
    const isHTML = isProbablyHTML(htmlText);
    expect(isHTML).toBe(true);
  });

  test('should detect XSS attempts as HTML and trigger sanitization', () => {
    // These should be detected as HTML so they get sanitized
    expect(isProbablyHTML('<script>alert(1)</script>')).toBe(true);
    expect(isProbablyHTML('<div onclick="evil()">text</div>')).toBe(true);
    expect(isProbablyHTML('<a href="javascript:void(0)">link</a>')).toBe(true);
    expect(isProbablyHTML('<body onload="alert(1)">')).toBe(true);
    expect(isProbablyHTML('<style>body{display:none}</style>')).toBe(true);
    expect(isProbablyHTML('<html><head><title>Fake</title></head></html>')).toBe(true);
  });

  test('should return false if the text does not contain HTML tags', () => {
    const plainText = 'Just a plain text';
    const isHTML = isProbablyHTML(plainText);
    expect(isHTML).toBe(false);

    const trickyText = 'a <= 10 and b > 10';
    expect(isProbablyHTML(trickyText)).toBe(false);
  });

  test('should return false for strings with angle brackets that are not HTML', () => {
    // Empty angle brackets
    expect(isProbablyHTML('<>')).toBe(false);

    // Single angle bracket
    expect(isProbablyHTML('<')).toBe(false);
    expect(isProbablyHTML('>')).toBe(false);

    // Comparison operators
    expect(isProbablyHTML('5 < 10')).toBe(false);
    expect(isProbablyHTML('10 > 5')).toBe(false);
    expect(isProbablyHTML('a <= b')).toBe(false);
    expect(isProbablyHTML('x >= y')).toBe(false);

    // Generic labels/tags that don't match HTML tag patterns
    expect(isProbablyHTML('<value>')).toBe(false);
    expect(isProbablyHTML('<data>')).toBe(false);
    expect(isProbablyHTML('<name>')).toBe(false);
    expect(isProbablyHTML('<tag>')).toBe(false);
    expect(isProbablyHTML('<foo>bar</foo>')).toBe(false);

    // Mathematical expressions
    expect(isProbablyHTML('if (x < 5 && y > 3)')).toBe(false);
    expect(isProbablyHTML('result: <pending>')).toBe(false);

    // Arrow notation
    expect(isProbablyHTML('A -> B')).toBe(false);
    expect(isProbablyHTML('<->')).toBe(false);
  });
});

describe('sanitizeHtmlIfNeeded', () => {
  test('should sanitize the HTML string if it contains HTML tags', () => {
    const htmlString = '<div>Some <b>HTML</b> content</div>';
    const sanitizedString = sanitizeHtmlIfNeeded(htmlString);
    expect(sanitizedString).toEqual(htmlString);
  });

  test('should return the string as is if it does not contain HTML tags', () => {
    const plainText = 'Just a plain text';
    const sanitizedString = sanitizeHtmlIfNeeded(plainText);
    expect(sanitizedString).toEqual(plainText);
  });
});

describe('safeHtmlSpan', () => {
  test('should return a safe HTML span when the input is HTML', () => {
    const htmlString = '<div>Some <b>HTML</b> content</div>';
    const safeSpan = safeHtmlSpan(htmlString);
    expect(safeSpan).toEqual(
      <span
        className="safe-html-wrapper"
        dangerouslySetInnerHTML={{ __html: htmlString }}
      />,
    );
  });

  test('should return the input string as is when it is not HTML', () => {
    const plainText = 'Just a plain text';
    const result = safeHtmlSpan(plainText);
    expect(result).toEqual(plainText);
  });

  test('should return plain text for angle brackets that are not HTML (bug fix)', () => {
    // These should NOT be treated as HTML and should be returned as-is
    expect(safeHtmlSpan('<>')).toBe('<>');
    expect(safeHtmlSpan('<value>')).toBe('<value>');
    expect(safeHtmlSpan('a < b')).toBe('a < b');
    expect(safeHtmlSpan('result: <pending>')).toBe('result: <pending>');
  });

  test('should still sanitize actual XSS attempts (security verification)', () => {
    // These should be treated as HTML and wrapped in sanitized span
    const xssAttempt = '<script>alert(1)</script>';
    const result = safeHtmlSpan(xssAttempt);

    // Should return a span element (not plain text)
    expect(result).toHaveProperty('type', 'span');
    expect(result).toHaveProperty('props.className', 'safe-html-wrapper');

    // The sanitized HTML should NOT contain the script tag
    const sanitizedHtml = (result as any).props.dangerouslySetInnerHTML.__html;
    expect(sanitizedHtml).not.toContain('script');
  });
});

describe('removeHTMLTags', () => {
  test('should remove HTML tags from the string', () => {
    const input = '<p>Hello, <strong>World!</strong></p>';
    const output = removeHTMLTags(input);
    expect(output).toBe('Hello, World!');
  });

  test('should return the same string when no HTML tags are present', () => {
    const input = 'This is a plain text.';
    const output = removeHTMLTags(input);
    expect(output).toBe('This is a plain text.');
  });

  test('should remove nested HTML tags and return combined text content', () => {
    const input = '<div><h1>Title</h1><p>Content</p></div>';
    const output = removeHTMLTags(input);
    expect(output).toBe('TitleContent');
  });

  test('should handle self-closing tags and return an empty string', () => {
    const input = '<img src="image.png" alt="Image">';
    const output = removeHTMLTags(input);
    expect(output).toBe('');
  });

  test('should handle malformed HTML tags and remove only well-formed tags', () => {
    const input = '<div><h1>Unclosed tag';
    const output = removeHTMLTags(input);
    expect(output).toBe('Unclosed tag');
  });
});

describe('isJsonString', () => {
  test('valid JSON object', () => {
    const jsonString = '{"name": "John", "age": 30, "city": "New York"}';
    expect(isJsonString(jsonString)).toBe(true);
  });

  test('valid JSON array', () => {
    const jsonString = '[1, 2, 3, 4, 5]';
    expect(isJsonString(jsonString)).toBe(true);
  });

  test('valid JSON string', () => {
    const jsonString = '"Hello, world!"';
    expect(isJsonString(jsonString)).toBe(true);
  });

  test('invalid JSON with syntax error', () => {
    const jsonString = '{"name": "John", "age": 30, "city": "New York"';
    expect(isJsonString(jsonString)).toBe(false);
  });

  test('empty string', () => {
    const jsonString = '';
    expect(isJsonString(jsonString)).toBe(false);
  });

  test('non-JSON string', () => {
    const jsonString = '<p>Hello, <strong>World!</strong></p>';
    expect(isJsonString(jsonString)).toBe(false);
  });

  test('non-JSON formatted number', () => {
    const jsonString = '12345abc';
    expect(isJsonString(jsonString)).toBe(false);
  });
});

describe('getParagraphContents', () => {
  test('should return an object with keys for each paragraph tag', () => {
    const htmlString =
      '<div><p>First paragraph.</p><p>Second paragraph.</p></div>';
    const result = getParagraphContents(htmlString);
    expect(result).toEqual({
      p1: 'First paragraph.',
      p2: 'Second paragraph.',
    });
  });

  test('should return null if the string is not HTML', () => {
    const nonHtmlString = 'Just a plain text string.';
    expect(getParagraphContents(nonHtmlString)).toBeNull();
  });

  test('should return null if there are no <p> tags in the HTML string', () => {
    const htmlStringWithoutP = '<div><span>No paragraph here.</span></div>';
    expect(getParagraphContents(htmlStringWithoutP)).toBeNull();
  });

  test('should return an object with empty string for empty <p> tag', () => {
    const htmlStringWithEmptyP = '<div><p></p></div>';
    const result = getParagraphContents(htmlStringWithEmptyP);
    expect(result).toEqual({ p1: '' });
  });

  test('should handle HTML strings with nested <p> tags correctly', () => {
    const htmlStringWithNestedP =
      '<div><p>First paragraph <span>with nested</span> content.</p></div>';
    const result = getParagraphContents(htmlStringWithNestedP);
    expect(result).toEqual({
      p1: 'First paragraph with nested content.',
    });
  });
});
