import React from "react";
import { mount } from "enzyme";

import connectField from "uniforms/connectField";
import createSchemaBridge from "uniforms/createSchemaBridge";
import injectName from "uniforms/injectName";
import nothing from "uniforms/nothing";
import randomIds from "uniforms/randomIds";

jest.mock("meteor/aldeed:simple-schema");
jest.mock("meteor/check");

describe("injectName", () => {
  const error = new Error();
  const onChange = () => {};
  const randomId = randomIds();
  const state = {
    changed: !1,
    changedMap: {},
    label: !0,
    disabled: !1,
    placeholder: !1,
    showInlineError: !0
  };
  const schema = createSchemaBridge({
    getDefinition(name) {
      return {
        fieldA: { type: Object, label: "FieldA" },
        "fieldA.fieldB": { type: Object, label: "FieldB" },
        "fieldA.fieldB.fieldC": { type: String, label: "FieldC" }
      }[name];
    },

    messageForError() {},

    objectKeys(name) {
      return {
        fieldA: ["FieldB"],
        "fieldA.FieldB": ["FieldC"],
        "fieldA.FieldB.FieldC": []
      }[name];
    },

    validator() {}
  });

  const reactContext = {
    context: {
      uniforms: {
        error,
        model: {},
        name: [],
        randomId,
        schema,
        state,
        onChange
      }
    }
  };

  const Test = jest.fn(
    ({ children }) =>
      children
        ? <span>
            {children}
          </span>
        : nothing
  );
  const Field = connectField(Test);

  beforeEach(() => {
    Test.mockClear();
  });

  describe("when called", () => {
    it("does nothing on normal elements", () => {
      mount(
        <Field name="fieldA">
          {injectName("fieldB", <Test />)}
        </Field>,
        reactContext
      );

      expect(Test.mock.calls[0]).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: "fieldA" })])
      );
      expect(Test.mock.calls[1]).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "fieldA.fieldB" })
        ])
      );
    });

    it("injects name into field", () => {
      mount(
        <Field name="fieldA">
          {injectName("fieldB", <Field />)}
        </Field>,
        reactContext
      );

      expect(Test.mock.calls[0]).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: "fieldA" })])
      );
      expect(Test.mock.calls[1]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "fieldA.fieldB" })
        ])
      );
    });

    it("injects name into fields", () => {
      mount(
        <Field name="fieldA">
          {injectName("fieldB", [
            <Field key={1} />,
            <Field key={2} />,
            <Field key={3} />
          ])}
        </Field>,
        reactContext
      );

      expect(Test.mock.calls[0]).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: "fieldA" })])
      );
      expect(Test.mock.calls[1]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "fieldA.fieldB" })
        ])
      );
      expect(Test.mock.calls[2]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "fieldA.fieldB" })
        ])
      );
      expect(Test.mock.calls[3]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "fieldA.fieldB" })
        ])
      );
    });

    it("injects name into nested field", () => {
      mount(
        <Field name="fieldA">
          {injectName(
            "fieldB",
            <span>
              <Field />
            </span>
          )}
        </Field>,
        reactContext
      );

      expect(Test.mock.calls[0]).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: "fieldA" })])
      );
      expect(Test.mock.calls[1]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "fieldA.fieldB" })
        ])
      );
    });

    it("injects name into nested fields", () => {
      mount(
        <Field name="fieldA">
          {injectName(
            "fieldB",
            <span>
              <Field />
              <Field />
              <Field />
            </span>
          )}
        </Field>,
        reactContext
      );

      expect(Test.mock.calls[0]).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: "fieldA" })])
      );
      expect(Test.mock.calls[1]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "fieldA.fieldB" })
        ])
      );
      expect(Test.mock.calls[2]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "fieldA.fieldB" })
        ])
      );
      expect(Test.mock.calls[3]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "fieldA.fieldB" })
        ])
      );
    });

    it("injects joined name", () => {
      mount(
        <Field name="fieldA">
          {injectName("fieldB", <Field name="fieldC" />)}

          {injectName(
            "fieldB",
            <span>
              <Field name="fieldC" />
            </span>
          )}
        </Field>,
        reactContext
      );

      expect(Test.mock.calls[0]).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: "fieldA" })])
      );
      expect(Test.mock.calls[1]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "fieldA.fieldB.fieldC" })
        ])
      );
      expect(Test.mock.calls[2]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "fieldA.fieldB.fieldC" })
        ])
      );
    });

    it("injects only the first level", () => {
      mount(
        <Field name="fieldA">
          {injectName(
            "fieldB",
            <Field name="fieldC">
              <Test name="fieldD" />
            </Field>
          )}

          {injectName(
            "fieldB",
            <span>
              <Field name="fieldC">
                <Test name="fieldD" />
              </Field>
            </span>
          )}
        </Field>,
        reactContext
      );

      expect(Test.mock.calls[2]).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: "fieldD" })])
      );
      expect(Test.mock.calls[4]).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: "fieldD" })])
      );
    });
  });
});
