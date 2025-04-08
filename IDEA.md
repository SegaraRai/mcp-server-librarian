## Tools to provide

### `knowledgeStructuringSession.start`

#### Parameters

- `sessionToken`: The token for the session to be started provided in the prompt.
- `documentName`: The name of the document to be structured provided in the prompt.
- `documentSource`: The source of the document to be structured. This can be a URL or a file path.
- `sectionFilepaths`: The files to be written in the session. This is a list of filepaths.

#### Response

```md
Accepted. Call `knowledgeStructuringSession.writeSection` to write the structured files.

**Session Token:** `<sessionToken>`

**Remaining Files:**

- /path/to/file1.md
- /path/to/file2.md
- ...

**Source Document:**

======

<!-- Source Document comes here -->
```

### `knowledgeStructuringSession.showSourceDocument`

#### Parameters

- `sessionToken`: The token for the session to be started provided in the prompt.
- `sourceDocumentRange`: The lines of the source document to be shown. This can be a range like `L123-L456` or `all`.

#### Response

Raw markdown response of the source document.

### `knowledgeStructuringSession.writeSection`

#### Parameters

- `sessionToken`: The token for the session to be started provided in the prompt.
- `sectionFilepath`: The filepath of the section to be written.
- `sectionTags`: The tags to be assigned to the section. This is a list of tags in lower-kebab-case.
- `sectionContent`: The content of the section to be written. This is a markdown string.
- `showSourceDocument`: Whether to include the source document in the response.
- `sourceDocumentRange`: The lines of the source document to be shown. This can be a range like `L123-L456` or `all`.

#### Response

```md
OK. Continue calling `knowledgeStructuringSession.writeSection` to write remaining files.
(or) OK. Call `knowledgeStructuringSession.end` to finish the session.
(or) Error. The specified filepath is not in the session.
(or) Error. The specified filepath is already completed.

**Session Token:** `<sessionToken>`

**Remaining Files:**

- /path/to/file2.md
- /path/to/file3.md
- ...

**Completed Files:**

- /path/to/file1.md

**Source Document:**

======

<!-- Source Document comes here -->
```

### `knowledgeStructuringSession.end`

#### Parameters

- `sessionToken`: The token for the session to be started provided in the prompts.

#### Response

```md
OK. The session is finished. The following files are written:

- /path/to/file1.md
- /path/to/file2.md
- /path/to/file3.md
- ...

You can now use these files for your work. Call `listDocuments` with `directory: "/foo/"` to see the list of documents.
```

or

```md
Error. Some files are not written yet. Call `knowledgeStructuringSession.writeSection` to write the remaining files.

**Session Token:** `<sessionToken>`

**Remaining Files:**

- /path/to/file1.md
- /path/to/file2.md
- /path/to/file3.md
- ...

**Completed Files:**

- /path/to/file1.md
```

or

```md
Error. The session does not exist or has already been finished.
```

## Prompts to provide

### `knowledgeStructure`

Session Token: `UUIDv4.HMAC-SHA256`
HMAC Secret: `{DocsRoot}\n{documentName}\n{documentSource}`

```md
You are an outstanding editor, well-versed in computer science and IT, and you are good at analyzing, classifying, and structuring documents.
Our ultimate goal is to break down a large document into sections, tag and organize them into a hierarchy of markdown files in a file tree.

To get started, let's understand the outline of the document.
Please focus on analyzing the structure of the document.

1. Read the document below (Source Document) thoroughly and understand its structure.
2. Identify the sections and subsections of the document and consider the filepath in lower-kebab-case for each. (e.g. `/path/to/dir/getting-started.md`).
3. Call `knowledgeStructuringSession.start` with the following `sessionToken`, `documentName`, `documentSource`, and the filepaths you considered.
   - `sessionToken`: "{UUIDv4.HMAC-SHA256}"
   - `documentName`: "{user-provided document name}"
   - `documentSource`: "{user-provided document source URL or file path}"

**Source Document:**

======

<!-- Source Document comes here -->
```

## Miscellaneous

タグよりサーチキーワードのほうが良かったりするかも？　要確認
