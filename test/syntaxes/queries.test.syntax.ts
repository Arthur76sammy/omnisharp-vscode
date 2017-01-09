/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Grammar", () => {
    before(() => should());

    describe("Query expressions", () => {
        it("from clause", () => {
            const input = Input.InMethod(`var q = from n in numbers`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Var,
                Token.Variables.Local("q"),
                Token.Operators.Assignment,
                Token.Keywords.Queries.From,
                Token.Identifiers.RangeVariableName("n"),
                Token.Keywords.Queries.In,
                Token.Variables.ReadWrite("numbers")
            ]);
        });

        it("from clause with type", () => {
            const input = Input.InMethod(`var q = from int n in numbers`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Var,
                Token.Variables.Local("q"),
                Token.Operators.Assignment,
                Token.Keywords.Queries.From,
                Token.PrimitiveType.Int,
                Token.Identifiers.RangeVariableName("n"),
                Token.Keywords.Queries.In,
                Token.Variables.ReadWrite("numbers")
            ]);
        });

        it("from clause followed by from clause", () => {
            const input = Input.InMethod(`
var q = from x in list1
        from y in list2
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Var,
                Token.Variables.Local("q"),
                Token.Operators.Assignment,
                Token.Keywords.Queries.From,
                Token.Identifiers.RangeVariableName("x"),
                Token.Keywords.Queries.In,
                Token.Variables.ReadWrite("list1"),
                Token.Keywords.Queries.From,
                Token.Identifiers.RangeVariableName("y"),
                Token.Keywords.Queries.In,
                Token.Variables.ReadWrite("list2")
            ]);
        });

        it("from clause, join clause", () => {
            const input = Input.InMethod(`
var q = from c in customers
        join o in orders on c.CustomerID equals o.CustomerID
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Var,
                Token.Variables.Local("q"),
                Token.Operators.Assignment,
                Token.Keywords.Queries.From,
                Token.Identifiers.RangeVariableName("c"),
                Token.Keywords.Queries.In,
                Token.Variables.ReadWrite("customers"),
                Token.Keywords.Queries.Join,
                Token.Identifiers.RangeVariableName("o"),
                Token.Keywords.Queries.In,
                Token.Variables.ReadWrite("orders"),
                Token.Keywords.Queries.On,
                Token.Variables.Object("c"),
                Token.Punctuation.Accessor, 
                Token.Variables.Property("CustomerID"),
                Token.Keywords.Queries.Equals,
                Token.Variables.Object("o"),
                Token.Punctuation.Accessor,
                Token.Variables.Property("CustomerID")
            ]);
        });

        it("from clause, join-into clause", () => {
            const input = Input.InMethod(`
var q = from c in customers
        join o in orders on c.CustomerID equals o.CustomerID into co
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Var,
                Token.Variables.Local("q"),
                Token.Operators.Assignment,
                Token.Keywords.Queries.From,
                Token.Identifiers.RangeVariableName("c"),
                Token.Keywords.Queries.In,
                Token.Variables.ReadWrite("customers"),
                Token.Keywords.Queries.Join,
                Token.Identifiers.RangeVariableName("o"),
                Token.Keywords.Queries.In,
                Token.Variables.ReadWrite("orders"),
                Token.Keywords.Queries.On,
                Token.Variables.Object("c"),
                Token.Punctuation.Accessor, 
                Token.Variables.Property("CustomerID"),
                Token.Keywords.Queries.Equals,
                Token.Variables.Object("o"),
                Token.Punctuation.Accessor,
                Token.Variables.Property("CustomerID"),
                Token.Keywords.Queries.Into,
                Token.Identifiers.RangeVariableName("co")
            ]);
        });

        it("from clause, orderby", () => {
            const input = Input.InMethod(`
var q = from o in orders
        orderby o.Customer.Name, o.Total
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Var,
                Token.Variables.Local("q"),
                Token.Operators.Assignment,
                Token.Keywords.Queries.From,
                Token.Identifiers.RangeVariableName("o"),
                Token.Keywords.Queries.In,
                Token.Variables.ReadWrite("orders"),
                Token.Keywords.Queries.OrderBy,
                Token.Variables.Object("o"),
                Token.Punctuation.Accessor,
                Token.Variables.Property("Customer"),
                Token.Punctuation.Accessor, 
                Token.Variables.Property("Name"),
                Token.Punctuation.Comma,
                Token.Variables.Object("o"),
                Token.Punctuation.Accessor,
                Token.Variables.Property("Total")
            ]);
        });

        it("from clause, orderby ascending", () => {
            const input = Input.InMethod(`
var q = from o in orders
        orderby o.Customer.Name ascending, o.Total
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Var,
                Token.Variables.Local("q"),
                Token.Operators.Assignment,
                Token.Keywords.Queries.From,
                Token.Identifiers.RangeVariableName("o"),
                Token.Keywords.Queries.In,
                Token.Variables.ReadWrite("orders"),
                Token.Keywords.Queries.OrderBy,
                Token.Variables.Object("o"),
                Token.Punctuation.Accessor,
                Token.Variables.Property("Customer"),
                Token.Punctuation.Accessor, 
                Token.Variables.Property("Name"),
                Token.Keywords.Queries.Ascending,
                Token.Punctuation.Comma,
                Token.Variables.Object("o"),
                Token.Punctuation.Accessor,
                Token.Variables.Property("Total")
            ]);
        });

        it("from clause, orderby descending", () => {
            const input = Input.InMethod(`
var q = from o in orders
        orderby o.Customer.Name, o.Total descending
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Var,
                Token.Variables.Local("q"),
                Token.Operators.Assignment,
                Token.Keywords.Queries.From,
                Token.Identifiers.RangeVariableName("o"),
                Token.Keywords.Queries.In,
                Token.Variables.ReadWrite("orders"),
                Token.Keywords.Queries.OrderBy,
                Token.Variables.Object("o"),
                Token.Punctuation.Accessor,
                Token.Variables.Property("Customer"),
                Token.Punctuation.Accessor, 
                Token.Variables.Property("Name"),
                Token.Punctuation.Comma,
                Token.Variables.Object("o"),
                Token.Punctuation.Accessor,
                Token.Variables.Property("Total"),
                Token.Keywords.Queries.Descending
            ]);
        });

        it("from and select", () => {
            const input = Input.InMethod(`
var q = from n in numbers
        select n;`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Var,
                Token.Variables.Local("q"),
                Token.Operators.Assignment,
                Token.Keywords.Queries.From,
                Token.Identifiers.RangeVariableName("n"),
                Token.Keywords.Queries.In,
                Token.Variables.ReadWrite("numbers"),
                Token.Keywords.Queries.Select,
                Token.Variables.ReadWrite("n"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("from and select with complex expressions", () => {
            const input = Input.InMethod(`
var q = from n in new[] { 1, 3, 5, 7, 9 }
        select n % 4 * 6;`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Var,
                Token.Variables.Local("q"),
                Token.Operators.Assignment,
                Token.Keywords.Queries.From,
                Token.Identifiers.RangeVariableName("n"),
                Token.Keywords.Queries.In,
                Token.Keywords.New,
                Token.Punctuation.OpenBracket,
                Token.Punctuation.CloseBracket,
                Token.Punctuation.OpenBrace,
                Token.Literals.Numeric.Decimal("1"),
                Token.Punctuation.Comma,
                Token.Literals.Numeric.Decimal("3"),
                Token.Punctuation.Comma,
                Token.Literals.Numeric.Decimal("5"),
                Token.Punctuation.Comma,
                Token.Literals.Numeric.Decimal("7"),
                Token.Punctuation.Comma,
                Token.Literals.Numeric.Decimal("9"),
                Token.Punctuation.CloseBrace,
                Token.Keywords.Queries.Select,
                Token.Variables.ReadWrite("n"),
                Token.Operators.Arithmetic.Remainder,
                Token.Literals.Numeric.Decimal("4"),
                Token.Operators.Arithmetic.Multiplication,
                Token.Literals.Numeric.Decimal("6"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("from and group by", () => {
            const input = Input.InMethod(`
var q = from c in customers
        group c by c.Country into g`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Var,
                Token.Variables.Local("q"),
                Token.Operators.Assignment,
                Token.Keywords.Queries.From,
                Token.Identifiers.RangeVariableName("c"),
                Token.Keywords.Queries.In,
                Token.Variables.ReadWrite("customers"),
                Token.Keywords.Queries.Group,
                Token.Variables.ReadWrite("c"),
                Token.Keywords.Queries.By,
                Token.Variables.Object("c"),
                Token.Punctuation.Accessor,
                Token.Variables.Property("Country"),
                Token.Keywords.Queries.Into,
                Token.Identifiers.RangeVariableName("g")
            ]);
        });
    });
});