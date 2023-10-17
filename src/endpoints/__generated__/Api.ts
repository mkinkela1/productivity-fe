/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export type CreateEventCategoryData = EventCategoryResponseDto;

export interface CreateEventCategoryRequestDto {
  colorHex: string;
  name: string;
  userId: string;
}

export type CreateNoteData = NoteResponseDto;

export interface CreateNoteDto {
  content: string;
  title: string;
}

export interface EventCategoryResponseDto {
  colorHex: string;
  id: string;
  name: string;
  userId: string;
}

export type GetEventCategoriesPaginatedData = EventCategoryResponseDto[];

export type GetEventCategoryData = EventCategoryResponseDto;

export type GetLoggedInUserData = LoggedInUserResponseDto;

export type GetNoteData = NoteResponseDto;

export type GetNotesPaginatedData = NoteResponseDto[];

export type GetUsersPaginatedData = GetUsersPaginatedResponseDto[];

export interface GetUsersPaginatedResponseDto {
  email: string;
  firstName: string;
  lastName: string;
}

export interface LoggedInUserResponseDto {
  firstName: string;
  id: string;
  lastName: string;
}

export type LoginData = LoginResponseDto;

export interface LoginDtoRequest {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  firstName: string;
  lastName: string;
  refreshToken: string;
}

export interface NoteResponseDto {
  content: string;
  id: string;
  title: string;
  userId: string;
}

export type RefreshTokenData = RefreshTokenResponseDto;

export interface RefreshTokenDtoRequest {
  refreshToken: string;
}

export interface RefreshTokenResponseDto {
  accessToken: string;
  refreshToken: string;
}

export type RegisterData = RegisterResponseDto;

export interface RegisterDtoRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface RegisterResponseDto {
  email: string;
  firstName: string;
  lastName: string;
}

export type UpdateEventCategoryData = EventCategoryResponseDto;

export interface UpdateEventCategoryRequestDto {
  colorHex: string;
  name: string;
}

export type UpdateNoteData = NoteResponseDto;

export interface UpdateNoteDto {
  content?: string;
  title?: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData
          ? { "Content-Type": type }
          : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Productivity app API
 * @version 1.0
 * @contact
 */
export class Api<SecurityDataType extends unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  api = {
    /**
     * No description
     *
     * @tags auth
     * @name Login
     * @request POST:/api/auth/login
     * @response `201` `LoginData`
     */
    login: (data: LoginDtoRequest, params: RequestParams = {}) =>
      this.http.request<LoginData, any>({
        path: `/api/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name Register
     * @request POST:/api/auth/register
     * @response `201` `RegisterData`
     * @response `409` `void`
     */
    register: (data: RegisterDtoRequest, params: RequestParams = {}) =>
      this.http.request<RegisterData, void>({
        path: `/api/auth/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name GetLoggedInUser
     * @request GET:/api/auth/me
     * @secure
     * @response `200` `GetLoggedInUserData`
     * @response `401` `void`
     */
    getLoggedInUser: (params: RequestParams = {}) =>
      this.http.request<GetLoggedInUserData, void>({
        path: `/api/auth/me`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name RefreshToken
     * @request POST:/api/auth/refresh-token
     * @response `201` `RefreshTokenData`
     * @response `401` `void`
     */
    refreshToken: (data: RefreshTokenDtoRequest, params: RequestParams = {}) =>
      this.http.request<RefreshTokenData, void>({
        path: `/api/auth/refresh-token`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name GetUsersPaginated
     * @request GET:/api/users
     * @secure
     * @response `200` `GetUsersPaginatedData`
     */
    getUsersPaginated: (params: RequestParams = {}) =>
      this.http.request<GetUsersPaginatedData, any>({
        path: `/api/users`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags events
     * @name CreateEventCategory
     * @request POST:/api/event-category
     * @secure
     * @response `201` `CreateEventCategoryData`
     */
    createEventCategory: (
      data: CreateEventCategoryRequestDto,
      params: RequestParams = {},
    ) =>
      this.http.request<CreateEventCategoryData, any>({
        path: `/api/event-category`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags events
     * @name GetEventCategoriesPaginated
     * @request GET:/api/event-category
     * @secure
     * @response `200` `GetEventCategoriesPaginatedData`
     */
    getEventCategoriesPaginated: (params: RequestParams = {}) =>
      this.http.request<GetEventCategoriesPaginatedData, any>({
        path: `/api/event-category`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags events
     * @name GetEventCategory
     * @request GET:/api/event-category/{id}
     * @secure
     * @response `200` `GetEventCategoryData`
     * @response `404` `void`
     */
    getEventCategory: (id: string, params: RequestParams = {}) =>
      this.http.request<GetEventCategoryData, void>({
        path: `/api/event-category/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags events
     * @name UpdateEventCategory
     * @request PATCH:/api/event-category/{id}
     * @secure
     * @response `200` `UpdateEventCategoryData`
     * @response `404` `void`
     */
    updateEventCategory: (
      id: string,
      data: UpdateEventCategoryRequestDto,
      params: RequestParams = {},
    ) =>
      this.http.request<UpdateEventCategoryData, void>({
        path: `/api/event-category/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags events
     * @name RemoveEventCategory
     * @request DELETE:/api/event-category/{id}
     * @secure
     * @response `404` `void`
     */
    removeEventCategory: (id: string, params: RequestParams = {}) =>
      this.http.request<any, void>({
        path: `/api/event-category/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags note
     * @name CreateNote
     * @request POST:/api/note
     * @secure
     * @response `201` `CreateNoteData`
     */
    createNote: (data: CreateNoteDto, params: RequestParams = {}) =>
      this.http.request<CreateNoteData, any>({
        path: `/api/note`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags note
     * @name GetNotesPaginated
     * @request GET:/api/note
     * @secure
     * @response `200` `GetNotesPaginatedData`
     */
    getNotesPaginated: (params: RequestParams = {}) =>
      this.http.request<GetNotesPaginatedData, any>({
        path: `/api/note`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags note
     * @name GetNote
     * @request GET:/api/note/{id}
     * @secure
     * @response `200` `GetNoteData`
     * @response `404` `void`
     */
    getNote: (id: string, params: RequestParams = {}) =>
      this.http.request<GetNoteData, void>({
        path: `/api/note/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags note
     * @name UpdateNote
     * @request PATCH:/api/note/{id}
     * @secure
     * @response `200` `UpdateNoteData`
     * @response `404` `void`
     */
    updateNote: (id: string, data: UpdateNoteDto, params: RequestParams = {}) =>
      this.http.request<UpdateNoteData, void>({
        path: `/api/note/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags note
     * @name RemoveNote
     * @request DELETE:/api/note/{id}
     * @secure
     * @response `404` `void`
     */
    removeNote: (id: string, params: RequestParams = {}) =>
      this.http.request<any, void>({
        path: `/api/note/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
}
