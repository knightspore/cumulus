import type {} from "@atcute/lexicons";
import * as v from "@atcute/lexicons/validations";
import type {} from "@atcute/lexicons/ambient";
import * as ComAtprotoRepoStrongRef from "@atcute/atproto/types/repo/strongRef";

const _mainSchema = /*#__PURE__*/ v.record(
  /*#__PURE__*/ v.tidString(),
  /*#__PURE__*/ v.object({
    $type: /*#__PURE__*/ v.literal("za.co.ciaran.cumulus.bet"),
    createdAt: /*#__PURE__*/ v.datetimeString(),
    /**
     * The record containing the Cumulus Market for this Bet
     */
    get market() {
      return ComAtprotoRepoStrongRef.mainSchema;
    },
    position: /*#__PURE__*/ v.literalEnum(["no", "yes"]),
  }),
);

type main$schematype = typeof _mainSchema;

export interface mainSchema extends main$schematype {}

export const mainSchema = _mainSchema as mainSchema;

export interface Main extends v.InferInput<typeof mainSchema> {}

declare module "@atcute/lexicons/ambient" {
  interface Records {
    "za.co.ciaran.cumulus.bet": mainSchema;
  }
}
