import { useEffect, useState } from "react";
import axiosBase from "axios";
import { useCookies } from "react-cookie";

const baseUrl = import.meta.env.VITE_URL_API;

export interface State<DataType> {
  loading: boolean;
  called: boolean;
  data: DataType | null;
  error: Error | null;
}

interface PathParams {
  [key: string]: string;
}

export interface Input<ParamType> {
  pathParams?: PathParams;
  params?: ParamType;
}
export interface MethodParam<ParamType> extends Input<ParamType> {
  method: "get" | "post" | "put" | "delete";
  path: string;
  eagerLoad?: boolean;
}

export interface Output<DataType, ParamType> extends State<DataType> {
  execute: (params?: ParamType) => Promise<DataType | Error>;
}

const useApi =
  <DataType, ParamType>(methodparam: MethodParam<ParamType>) =>
  (input?: Input<ParamType>): Output<DataType, ParamType> => {
    const {
      path,
      method,
      eagerLoad = false,
      pathParams: initialPathParams = {} as PathParams,
      params: initialParams = {} as ParamType,
    } = methodparam;
    const { pathParams = initialPathParams, params = initialParams } =
      input || {};

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [state, setState] = useState<State<DataType>>({
      loading: false,
      called: false,
      data: null,
      error: null,
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [cookies] = useCookies();
    const token = cookies?.token || "";

    const axios = axiosBase.create({
      headers: {
        "Cache-Control": "no-cache",
        Authorization: `Bearer ${token}`,
      },
      baseURL: baseUrl,
      withCredentials: true,
    });

    const execute = async (params?: ParamType): Promise<DataType | Error> => {
      try {
        const pathReplaced = pathParams
          ? Object.entries(pathParams).reduce(
              (acc, [key, value]) => acc.replace(`:${key}`, value),
              path
            )
          : path;
        setState((prev) => ({
          ...prev,
          loading: true,
          called: true,
          error: null,
        }));
        const result = !params
          ? await axios[method](pathReplaced)
          : method === "get"
          ? await axios[method](pathReplaced, { params })
          : await axios[method](pathReplaced, params);
        const data = result.data;
        setState((prev) => ({ ...prev, loading: false, data }));
        return data as DataType;
      } catch (e) {
        setState((prev) => ({ ...prev, loading: false, error: e as Error }));
        return e as Error;
      }
    };
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (eagerLoad) execute(params);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return { execute, ...state };
  };

export default useApi;
