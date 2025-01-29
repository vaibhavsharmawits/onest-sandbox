/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_REACT_SERVER_URL: string
  readonly MOCKSERVER_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}