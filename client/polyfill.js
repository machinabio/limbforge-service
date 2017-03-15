import text_encoding from 'text-encoding';

global.TextDecoder = new text_encoding.TextDecoder();
global.TextEncoder = new text_encoding.TextEncoder();
