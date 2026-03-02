#!/usr/bin/env python3
"""
Compress entity-ext.js by replacing frequent string literals with short variable references.
Run from project root: python3 scripts/compress-entity-ext.py

Savings target: -63KB
Strategy:
  1. Define new shorthand vars at top of entity-ext.js (_CA, _TID, etc.)
  2. Replace frequent string literals with var references
  3. Also reuse existing common.js vars (_U, _D, _IA, _SA, _SD, _SP, _T, _N, _TS)
  4. Compact multi-line arrays to single lines (save ~4.5KB in newlines)
"""

import re
import os

src_path = 'src/data/entity-ext.js'

with open(src_path, 'r', encoding='utf-8') as f:
    content = f.read()

original_size = len(content.encode('utf-8'))
print(f'Original size: {original_size:,} bytes ({len(content.splitlines())} lines)')

# ── Step 1: Define replacement map ──────────────────────────────────────────
# Format: { 'JS_string_literal_with_quotes': 'VAR_NAME' }
# NOTE: strings with escaped quotes like \'active\' appear in the file as backslash+quote

# New vars to define IN entity-ext.js (not in common.js)
NEW_VARS = {
    # var_name: string_value (without surrounding quotes, as it appears at runtime)
    '_CA':     'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at',
    '_TID':    'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
    '_PID':    'project_id:UUID:FK:プロジェクトID:Project ID',
    '_COMP':   'completed_at:TIMESTAMP::完了日時:Completed at',
    '_OID':    'owner_id:UUID:FK(User) NOT NULL:オーナーID:Owner ID',
    '_FN':     'full_name:VARCHAR(200):NOT NULL:氏名:Full name',
    '_RA':     'recorded_at:TIMESTAMP:NOT NULL:記録日時:Recorded at',
    '_SUBAT':  'submitted_at:TIMESTAMP::提出日時:Submitted at',
    '_PUBL':   'published_at:TIMESTAMP::公開日時:Published at',
    '_RESOL':  'resolved_at:TIMESTAMP::解決日時:Resolved at',
    '_MEASAT': 'measured_at:TIMESTAMP:NOT NULL:計測日時:Measured at',
    '_GENDAT': 'generated_at:TIMESTAMP:DEFAULT NOW():生成日時:Generated at',
    '_T300':   'title:VARCHAR(300):NOT NULL:タイトル:Title',
    '_FILEURL':'file_url:TEXT:NOT NULL:ファイルURL:File URL',
    '_CNTEXT': 'content:TEXT:NOT NULL:内容:Content',
    '_CREATEDBY': 'created_by:UUID:FK(User) NOT NULL:作成者ID:Created by',
}

# Existing vars from common.js (available when entity-ext.js runs in build)
# We'll USE these but NOT redefine them in entity-ext.js
EXISTING_VARS = {
    '_U':   'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
    '_D':   'description:TEXT::説明:Description',
    '_IA':  'is_active:BOOLEAN:DEFAULT true:有効:Active',
    '_T':   'title:VARCHAR(255):NOT NULL:タイトル:Title',
    '_N':   'notes:TEXT::メモ:Notes',
    # Status vars with escaped quotes (runtime value contains single quotes)
    '_SA':  "status:VARCHAR(20):DEFAULT 'active':ステータス:Status",
    '_SD':  "status:VARCHAR(20):DEFAULT 'draft':ステータス:Status",
    '_SP':  "status:VARCHAR(20):DEFAULT 'pending':ステータス:Status",
    # TS: 'created_at:TIMESTAMP:DEFAULT NOW:作成日時:Created at'
    '_TS':  'created_at:TIMESTAMP:DEFAULT NOW:作成日時:Created at',
    '_SO':  'sort_order:INT:DEFAULT 0:表示順:Display order',
    '_CAT': 'category:VARCHAR(100)::カテゴリ:Category',
    '_MSG': 'message:TEXT::メッセージ:Message',
    '_N':   'notes:TEXT::メモ:Notes',
    '_URL': 'url:TEXT::URL:URL',
}

# ── Step 2: Build the JS-literal search strings ───────────────────────────
# For a string like "status:VARCHAR(20):DEFAULT 'active':ステータス:Status",
# in the JS file it appears as: 'status:VARCHAR(20):DEFAULT \'active\':ステータス:Status'
# In Python file content (read as text), the backslash-quote is two chars: \\'

def make_js_literal(value):
    """Convert a runtime string value to its JS single-quoted literal as it appears in the file."""
    # Escape single quotes with backslash (JS single-quoted string)
    escaped = value.replace("'", "\\'")
    return f"'{escaped}'"

# Build combined replacement map: literal_in_file -> var_name
all_replacements = {}
for var_name, value in NEW_VARS.items():
    js_lit = make_js_literal(value)
    all_replacements[js_lit] = var_name
for var_name, value in EXISTING_VARS.items():
    js_lit = make_js_literal(value)
    all_replacements[js_lit] = var_name

# Sort by length (longest first) to avoid partial replacements
replacements_sorted = sorted(all_replacements.items(), key=lambda x: -len(x[0]))

# ── Step 3: Apply replacements ───────────────────────────────────────────────
print('\nReplacement statistics:')
total_saved = 0

for js_lit, var_name in replacements_sorted:
    count = content.count(js_lit)
    if count > 0:
        # Savings: replacing 'long string' (len(js_lit) bytes) with _VAR (len(var_name) bytes)
        saved = count * (len(js_lit.encode('utf-8')) - len(var_name))
        total_saved += saved
        content = content.replace(js_lit, var_name)
        print(f'  {var_name:12s}: {count:4d}x → saves {saved:6,}B  [{js_lit[:60]}...]')

# ── Step 4: Compact multi-line ENTITY_COLUMNS arrays to single lines ─────────
print('\nCompacting multi-line arrays...')

# Match: ENTITY_COLUMNS['Name']=[\n  ...\n];
# Regex: Find each entity block and collapse to one line
def compact_entity(m):
    """Convert multi-line array to single line."""
    prefix = m.group(1)   # ENTITY_COLUMNS['Name']=[
    body   = m.group(2)   # the array contents (may span lines)
    suffix = m.group(3)   # ];

    # Split body into items, strip whitespace and join
    items = [item.strip() for item in body.split('\n') if item.strip()]
    # Remove trailing commas from last item if any
    compacted_body = ','.join(item.rstrip(',') for item in items if item)
    return f'{prefix}{compacted_body}{suffix}'

# Pattern: ENTITY_COLUMNS[...]=[ ... ]; spanning multiple lines
pattern = re.compile(
    r"(ENTITY_COLUMNS\['[^']+'\]=\[)"    # group 1: opening
    r"([\s\S]*?)"                          # group 2: content
    r"(\];)",                              # group 3: closing
    re.MULTILINE
)

before_compact = content
content = pattern.sub(compact_entity, content)
compact_saved = len(before_compact.encode('utf-8')) - len(content.encode('utf-8'))
print(f'  Compaction saved: {compact_saved:,} bytes')

# ── Step 5: Add new var definitions at the top ─────────────────────────────
# Build the var block to insert
var_lines = ['// Compression shorthand vars (defined here; common.js vars like _U/_D/_SA also used)']
for var_name, value in NEW_VARS.items():
    # Use double quotes if value contains single quotes, else single quotes
    if "'" in value:
        js_val = f'"{value}"'
    else:
        js_val = f"'{value}'"
    var_lines.append(f'var {var_name}={js_val};')

var_block = '\n'.join(var_lines) + '\n\n'

# Insert after the comment block at the top (after the closing */ and blank line)
# Find insertion point: first ENTITY_COLUMNS assignment
insert_pos = content.find("ENTITY_COLUMNS['")
if insert_pos == -1:
    insert_pos = content.find('ENTITY_COLUMNS[')

content = content[:insert_pos] + var_block + content[insert_pos:]

# ── Step 6: Write output ──────────────────────────────────────────────────
with open(src_path, 'w', encoding='utf-8') as f:
    f.write(content)

new_size = len(content.encode('utf-8'))
new_lines = len(content.splitlines())
total_reduction = original_size - new_size

print(f'\n{"="*60}')
print(f'Original: {original_size:>10,} bytes ({len(before_compact.splitlines()):,} lines)')
print(f'New:      {new_size:>10,} bytes ({new_lines:,} lines)')
print(f'Saved:    {total_reduction:>10,} bytes ({total_reduction/1024:.1f} KB)')
print(f'  String replacement: ~{total_saved:,} bytes')
print(f'  Compaction:         ~{compact_saved:,} bytes')
print(f'  Var block overhead: ~{len(var_block.encode("utf-8")):,} bytes')
print(f'\n✓ Written to {src_path}')
