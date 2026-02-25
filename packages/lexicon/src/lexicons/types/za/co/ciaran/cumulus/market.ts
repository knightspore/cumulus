import type {} from "@atcute/lexicons";
import * as v from "@atcute/lexicons/validations";
import type {} from "@atcute/lexicons/ambient";

const _mainSchema = /*#__PURE__*/ v.record(
  /*#__PURE__*/ v.tidString(),
  /*#__PURE__*/ v.object({
    $type: /*#__PURE__*/ v.literal("za.co.ciaran.cumulus.market"),
    closesAt: /*#__PURE__*/ v.datetimeString(),
    createdAt: /*#__PURE__*/ v.datetimeString(),
    liquidity: /*#__PURE__*/ v.literalEnum([10, 200, 50]),
    /**
     * @maxLength 140
     */
    question: /*#__PURE__*/ v.constrain(/*#__PURE__*/ v.string(), [
      /*#__PURE__*/ v.stringLength(0, 140),
    ]),
  }),
);

type main$schematype = typeof _mainSchema;

export interface mainSchema extends main$schematype {}

export const mainSchema = _mainSchema as mainSchema;

export interface Main extends v.InferInput<typeof mainSchema> {}

declare module "@atcute/lexicons/ambient" {
  interface Records {
    "za.co.ciaran.cumulus.market": mainSchema;
  }
}
