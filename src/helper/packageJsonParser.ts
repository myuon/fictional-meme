export interface PackageJsonDependency {
  dependencies: PackageItem[];
  devDependencies: PackageItem[];
}

export interface PackageItem {
  name: Token;
  version: Token;
}

export interface Token {
  type: string;
  loc: {
    line: number;
    column: number;
  };
  value: string;
}

type AstItem =
  | {
      type: "object";
      value: { key: Token; value: Ast }[];
    }
  | {
      type: "array";
      value: Ast[];
    }
  | {
      type: "string";
      value: Token;
    };
type Ast = AstItem[];

export const parsePackageJson = (input: string) => {
  const tokenize = (input: string) => {
    const tokens = [];
    let loc = { line: 1, column: 0 };
    let pos = 0;

    const next = () => {
      if (input[pos] === "\n") {
        loc = { line: loc.line + 1, column: 0 };
      } else {
        loc = { ...loc, column: loc.column + 1 };
      }

      pos++;
    };

    const tryRegisterToken = (token: string) => {
      if (input.slice(pos).startsWith(token)) {
        tokens.push({
          type: token,
          loc,
        });

        pos += token.length;
        loc = { ...loc, column: loc.column + token.length };
      }
    };

    while (pos < input.length) {
      const ch = input[pos];

      if (ch == '"') {
        const stringStart = pos;
        const currentLoc = loc;
        next();

        while (input[pos] != '"') {
          if (input[pos] === "\\" && input[pos + 1] === '"') {
            next();
            next();
          } else {
            next();
          }
        }

        const stringEnd = pos;

        tokens.push({
          type: "string",
          loc: currentLoc,
          value: input.slice(stringStart + 1, stringEnd), // strip double quotes
        });
      } else {
        tryRegisterToken("true");
        tryRegisterToken("false");
        tryRegisterToken("null");
        tryRegisterToken("[");
        tryRegisterToken("]");
        tryRegisterToken("{");
        tryRegisterToken("}");
        tryRegisterToken(",");
        tryRegisterToken(":");
      }

      next();
    }

    return tokens;
  };
  const parser = (tokens: Token[]) => {
    let pos = 0;

    const consume = (type?: string) => {
      const token = tokens[pos];
      if (type && token.type !== type) {
        throw new Error(`Expected ${type} but got ${tokens[pos].type}`);
      }

      pos++;
      return token;
    };

    const parse = () => {
      const ast = [] as Ast;

      if (tokens[pos].type === "{") {
        consume("{");
        const keyValue = [];

        // object
        do {
          const key = consume("string");
          consume(":");
          const value = parse();

          keyValue.push({
            key,
            value,
          });

          if (tokens[pos].type === "}") {
            consume("}");
            break;
          }
        } while (consume(","));

        ast.push({
          type: "object",
          value: keyValue,
        });
      } else if (tokens[pos].type === "[") {
        consume("[");
        const array = [];

        // array
        do {
          array.push(parse());

          if (tokens[pos].type === "]") {
            consume("]");
            break;
          }
        } while (consume(","));

        ast.push({
          type: "array",
          value: array,
        });
      } else if (tokens[pos].type === "string") {
        // string
        ast.push({
          type: "string",
          value: consume("string"),
        });
      }

      return ast;
    };

    return parse();
  };
  const analyze = (ast: Ast) => {
    const asObject = (ast: Ast | undefined) => {
      if (ast?.[0]) {
        if (ast[0].type === "object") {
          return ast[0].value;
        }
      }

      return undefined;
    };
    const asString = (ast: Ast | undefined) => {
      if (ast?.[0]) {
        if (ast[0]?.type === "string") {
          return ast[0].value;
        }
      }

      return undefined;
    };

    const getDependencies = (
      ast:
        | {
            key: Token;
            value: Ast;
          }[]
        | undefined,
      keyName: string
    ) => {
      const items = [] as PackageItem[];

      const section = asObject(
        ast?.find((item) => item.key.value === keyName)?.value
      );
      if (section) {
        section.forEach((item) => {
          const version = asString(item.value);
          if (!version) {
            return;
          }

          items.push({
            name: item.key,
            version,
          });
        });
      }

      return items;
    };

    const pkg: PackageJsonDependency = {
      dependencies: [],
      devDependencies: [],
    };

    const root = asObject(ast);
    if (root) {
      pkg.dependencies = getDependencies(root, "dependencies");
      pkg.devDependencies = getDependencies(root, "devDependencies");
    }

    return pkg;
  };

  return analyze(parser(tokenize(input)));
};
