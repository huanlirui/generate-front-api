import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {
  MedicalOrgVo,
  TableDataInfoMedicalOrgVo,
  TreeLong,
  DelBasicManageMedicalOrgQuery,
  ListMedicalOrgListQuery,
  QueryMedicalOrgExportWithOptionsQuery,
  QueryMedicalOrgTreeQuery,
  UpdateBasicManageMedicalOrgData,
  AddBasicManageMedicalOrgData,
} from "./types";

/**
 * 机构信息修改
 * @param * @param data
 
 */
export const updateBasicManageMedicalOrg = (
  data: UpdateBasicManageMedicalOrgData,
): AxiosPromise<void> => {
  return request({
    url: "/hr/basicManage/medicalOrg",
    method: "put",
    data: data,
  });
};
/**
 * 机构信息新增
 * @param * @param data
 
 */
export const addBasicManageMedicalOrg = (
  data: AddBasicManageMedicalOrgData,
): AxiosPromise<void> => {
  return request({
    url: "/hr/basicManage/medicalOrg",
    method: "post",
    data: data,
  });
};
/**
 * 机构信息删除/批量删除
 * @param * @param params
 
 */
export const delBasicManageMedicalOrg = (
  params?: DelBasicManageMedicalOrgQuery,
): AxiosPromise<void> => {
  return request({
    url: "/hr/basicManage/medicalOrg",
    method: "delete",
    params: params,
  });
};
/**
 * excel批量导入
 * @param 
 
 */
export const addMedicalOrgImportWithOptions = (): AxiosPromise<void> => {
  return request({
    url: "/hr/basicManage/medicalOrg/importWithOptions",
    method: "post",
  });
};
/**
 * 机构信息详情查询
 * @param * @param orgId
 * @returns {*}
 */
export const getBasicManageMedicalOrg = (
  orgId: number,
): AxiosPromise<MedicalOrgVo> => {
  return request({
    url: `/hr/basicManage/medicalOrg/${orgId}`,
    method: "get",
  });
};
/**
 * 机构信息分页查询
 * @param * @param query
 * @returns {*}
 */
export const listMedicalOrgList = (
  query?: ListMedicalOrgListQuery,
): AxiosPromise<TableDataInfoMedicalOrgVo> => {
  return request({
    url: "/hr/basicManage/medicalOrg/list",
    method: "get",
    params: query,
  });
};
/**
 * excel批量导出/导出模板
 * @param * @param query
 * @returns {*}
 */
export const queryMedicalOrgExportWithOptions = (
  query?: QueryMedicalOrgExportWithOptionsQuery,
): AxiosPromise<any> => {
  return request({
    url: "/hr/basicManage/medicalOrg/exportWithOptions",
    method: "get",
    params: query,
  });
};
/**
 * 机构信息树查询
 * @param * @param query
 * @returns {*}
 */
export const queryMedicalOrgTree = (
  query?: QueryMedicalOrgTreeQuery,
): AxiosPromise<TreeLong[]> => {
  return request({
    url: "/hr/basicManage/medicalOrg/tree",
    method: "get",
    params: query,
  });
};
