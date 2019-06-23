// https://docs.codecov.io/reference#section-upload-query-as-seen-as-query-below
export type TServiceConfig = {
  commit?: string,
  branch?: string,
  build?: string,
  job?: string,
  build_url?: string,
  name?: string,
  slug?: string,
  yaml?: string,
  service?: string,
  flags?: string,
  pr?: string,
} | null
