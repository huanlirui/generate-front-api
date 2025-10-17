export interface MedicalOrgVo {
  /**
   * 机构代码
   */
  orgCode?: string;

  /**
   * 机构名称
   */
  orgName?: string;

  /**
   * 机构等级
   */
  hospitalLevel?: string;

  /**
   * 机构等级名称
   */
  hospitalLevelName?: string;

  /**
   * XX机构所有制类型
   */
  medicalBelongType?: string;

  /**
   * XX机构所有制类型名称
   */
  medicalBelongTypeName?: string;

  /**
   * XX机构服务类型
   */
  medicalServiceType?: string;

  /**
   * XX机构服务类型名称
   */
  medicalServiceTypeName?: string;

  /**
   * XX机构标识
   */
  medicalFlag?: string;

  /**
   * XX机构标识名称
   */
  medicalFlagName?: string;

  /**
   * 机构性质（0管理机构 1XX机构）
   */
  type?: string;

  /**
   * 机构性质名称
   */
  typeName?: string;

  /**
   * 行政区划代码
   */
  admCode?: string;

  /**
   * 行政区划名称
   */
  admName?: string;

  /**
   * 互认状态
   */
  hrStatus?: string;

  /**
   * 互认状态名称
   */
  hrStatusName?: string;

  /**
   * 互认范围：全国HR，本省HR，昆明HR
   */
  hrScope?: string;

  /**
   * 互认范围中文名称
   */
  hrScopeName?: string;

  /**
   * XX机构服务类型
   */
  serviceType?: string;

  /**
   * XX机构服务类型名称
   */
  serviceTypeName?: string;

  /**
   * XX机构标识
   */
  flag?: string;

  /**
   * XX机构标识名称
   */
  flagName?: string;

  /**
   * 管辖单位ID
   */
  administerId?: string | number;

  /**
   * 互认资质有效开始时间
   */
  hrValidStartTime?: string;

  /**
   * 互认资质有效结束时间
   */
  hrValidEndTime?: string;

  /**
   * 机构简称
   */
  orgShortName?: string;

  /**
   * 所属省市
   */
  provinceCity?: string;

  /**
   * 所属区/县
   */
  districtCounty?: string;

  /**
   * 定点XX机构代码
   */
  medicalInsCode?: string;

  /**
   * 统一社会信用代码
   */
  unifiedSocialCreditCode?: string;

  /**
   * 部门ID
   */
  deptId?: string | number;

  /**
   * 父部门ID
   */
  parentId?: string | number;

  /**
   * 部门类别编码
   */
  deptCategory?: string;

  /**
   * 显示顺序
   */
  orderNum?: number;

  /**
   * 负责人
   */
  leader?: string | number;

  /**
   * 联系电话
   */
  phone?: string;

  /**
   * 邮箱
   */
  email?: string;

  /**
   * 机构状态:0正常,1停用
   */
  status?: string;

  /**
   * 园区编码
   */
  campusCode?: string;

  /**
   * 院区名称
   */
  campusName?: string;

  /**
   * 详细地址
   */
  address?: string;

  /**
   * 互认标签列表
   */
  labels?: string;
}

export interface TableDataInfoMedicalOrgVo {
  /**
   * 总记录数
   */
  total?: string | number;

  /**
   * 列表数据
   */
  rows?: MedicalOrgVo[];

  /**
   * 消息状态码
   */
  code?: number;

  /**
   * 消息内容
   */
  msg?: string;
}

export interface TreeLong {
  name?: any;

  id?: string | number;

  parentId?: string | number;

  config?: TreeNodeConfig;

  weight?: string;

  empty?: boolean;
}

export interface TreeNodeConfig {
  idKey?: string;

  parentIdKey?: string;

  weightKey?: string;

  nameKey?: string;

  childrenKey?: string;

  deep?: number;
}

// 查询参数接口定义
export interface DelBasicManageMedicalOrgQuery {
  /** XX机构ID */
  deptIds?: string[];
}

export interface ListMedicalOrgListQuery {
  /** 机构ID */
  deptId?: number;

  /** 所属机构ID */
  parentId?: number;

  /** 部门名称 */
  deptName?: string;

  /** 行政区划代码 */
  admCode?: string;

  /** 行政区划名称 */
  admName?: string;

  /** 机构编码，唯一标识 */
  orgCode?: string;

  /** 定点XX机构代码 */
  medicalInsCode?: string;

  /** 统一社会信用代码 */
  unifiedSocialCreditCode?: string;

  /** 医院等级 */
  hospitalLevel?: string;

  /** 所属省市中文 */
  provinceCity?: string;

  /** 所属区县中文 */
  districtCounty?: string;

  /** 机构类别编码 */
  deptCategory?: string;

  /** 负责人 */
  leader?: number;

  /** 联系电话 */
  phone?: string;

  /** 邮箱 */
  email?: string;

  /** 机构状态:0正常,1停用 */
  status?: string;

  /** 机构简称 */
  orgShortName?: string;

  /** 互认范围：全国HR，本省HR，昆明HR */
  hrScope?: string;

  /** 互认资质有效开始时间 */
  hrValidStartTime?: string;

  /** 互认资质有效结束时间 */
  hrValidEndTime?: string;

  /** 互认状态 */
  hrStatus?: string;

  /** XX机构所有制类型 */
  medicalBelongType?: string;

  /** XX机构服务类型 */
  medicalServiceType?: string;

  /** XX机构标识 */
  medicalFlag?: string;

  /** 机构类型（0：管理机构、1：XX机构） */
  type?: string;

  /** 显示顺序 */
  orderNum?: number;

  /** 园区编码 */
  campusCode?: string;

  /** 院区名称 */
  campusName?: string;

  /** 详细地址 */
  address?: string;

  /** 分页大小 */
  pageSize?: number;

  /** 当前页数 */
  pageNum?: number;

  /** 排序列 */
  orderByColumn?: string;

  /** 排序的方向desc或者asc */
  isAsc?: string;
}

export interface QueryMedicalOrgExportWithOptionsQuery {
  /** 组织机构ID */
  deptIds?: string[];
}

export interface QueryMedicalOrgTreeQuery {
  /** 创建部门 */
  createDept?: number;

  /** 创建者 */
  createBy?: number;

  /** 创建时间 */
  createTime?: string;

  /** 更新者 */
  updateBy?: number;

  /** 更新时间 */
  updateTime?: string;

  /** 请求参数 */
  params?: string;

  /** 机构ID */
  deptId?: number;

  /** 所属机构ID */
  parentId?: number;

  /** 部门名称 */
  deptName?: string;

  /** 行政区划代码 */
  admCode?: string;

  /** 行政区划名称 */
  admName?: string;

  /** 机构编码，唯一标识 */
  orgCode?: string;

  /** 定点XX机构代码 */
  medicalInsCode?: string;

  /** 统一社会信用代码 */
  unifiedSocialCreditCode?: string;

  /** 医院等级 */
  hospitalLevel?: string;

  /** 所属省市中文 */
  provinceCity?: string;

  /** 所属区县中文 */
  districtCounty?: string;

  /** 机构类别编码 */
  deptCategory?: string;

  /** 负责人 */
  leader?: number;

  /** 联系电话 */
  phone?: string;

  /** 邮箱 */
  email?: string;

  /** 机构状态:0正常,1停用 */
  status?: string;

  /** 机构简称 */
  orgShortName?: string;

  /** 互认范围：全国HR，本省HR，昆明HR */
  hrScope?: string;

  /** 互认资质有效开始时间 */
  hrValidStartTime?: string;

  /** 互认资质有效结束时间 */
  hrValidEndTime?: string;

  /** 互认状态 */
  hrStatus?: string;

  /** XX机构所有制类型 */
  medicalBelongType?: string;

  /** XX机构服务类型 */
  medicalServiceType?: string;

  /** XX机构标识 */
  medicalFlag?: string;

  /** 机构类型（0：管理机构、1：XX机构） */
  type?: string;

  /** 显示顺序 */
  orderNum?: number;

  /** 园区编码 */
  campusCode?: string;

  /** 院区名称 */
  campusName?: string;

  /** 详细地址 */
  address?: string;
}

// 请求体接口定义
export interface UpdateBasicManageMedicalOrgRequestData {
  /**
   * 机构ID
   */
  deptId: string | number;

  /**
   * 所属父机构【管理机构】ID
   */
  parentId: string | number;

  /**
   * 部门名称
   */
  deptName: string;

  /**
   * 行政区划代码
   */
  admCode: string;

  /**
   * 行政区划名称
   */
  admName?: string;

  /**
   * 机构编码，唯一标识
   */
  orgCode: string;

  /**
   * 定点XX机构代码
   */
  medicalInsCode: string;

  /**
   * 统一社会信用代码
   */
  unifiedSocialCreditCode?: string;

  /**
   * 医院等级
   */
  hospitalLevel: string;

  /**
   * 所属省市中文
   */
  provinceCity?: string;

  /**
   * 所属区县中文
   */
  districtCounty?: string;

  /**
   * 机构类别编码
   */
  deptCategory?: string;

  /**
   * 负责人
   */
  leader?: string | number;

  /**
   * 联系电话
   */
  phone?: string;

  /**
   * 邮箱
   */
  email?: string;

  /**
   * 机构状态:0正常,1停用
   */
  status?: string;

  /**
   * 机构简称
   */
  orgShortName?: string;

  /**
   * 互认范围：全国HR，本省HR，昆明HR
   */
  hrScope: string;

  /**
   * 互认资质有效开始时间
   */
  hrValidStartTime?: string;

  /**
   * 互认资质有效结束时间
   */
  hrValidEndTime?: string;

  /**
   * 互认状态
   */
  hrStatus: string;

  /**
   * XX机构所有制类型
   */
  medicalBelongType: string;

  /**
   * XX机构服务类型
   */
  medicalServiceType: string;

  /**
   * XX机构标识
   */
  medicalFlag: string;

  /**
   * 机构类型（0：管理机构、1：XX机构）
   */
  type: string;

  /**
   * 显示顺序
   */
  orderNum?: number;

  /**
   * 园区编码
   */
  campusCode?: string;

  /**
   * 院区名称
   */
  campusName?: string;

  /**
   * 详细地址
   */
  address?: string;

  /**
   * 互认标签列表
   */
  labels?: string;
}
export interface AddBasicManageMedicalOrgRequestData {
  /**
   * 所属父机构【管理机构】ID
   */
  parentId: string | number;

  /**
   * 部门名称
   */
  deptName: string;

  /**
   * 行政区划代码
   */
  admCode: string;

  /**
   * 行政区划名称
   */
  admName?: string;

  /**
   * 机构编码，唯一标识
   */
  orgCode: string;

  /**
   * 定点XX机构代码
   */
  medicalInsCode: string;

  /**
   * 统一社会信用代码
   */
  unifiedSocialCreditCode?: string;

  /**
   * 医院等级
   */
  hospitalLevel: string;

  /**
   * 所属省市中文
   */
  provinceCity?: string;

  /**
   * 所属区县中文
   */
  districtCounty?: string;

  /**
   * 机构类别编码
   */
  deptCategory?: string;

  /**
   * 负责人
   */
  leader?: string | number;

  /**
   * 联系电话
   */
  phone?: string;

  /**
   * 邮箱
   */
  email?: string;

  /**
   * 机构状态:0正常,1停用
   */
  status?: string;

  /**
   * 机构简称
   */
  orgShortName?: string;

  /**
   * 互认范围：全国HR，本省HR，昆明HR
   */
  hrScope: string;

  /**
   * 互认资质有效开始时间
   */
  hrValidStartTime?: string;

  /**
   * 互认资质有效结束时间
   */
  hrValidEndTime?: string;

  /**
   * 互认状态
   */
  hrStatus: string;

  /**
   * XX机构所有制类型
   */
  medicalBelongType: string;

  /**
   * XX机构服务类型
   */
  medicalServiceType: string;

  /**
   * XX机构标识
   */
  medicalFlag: string;

  /**
   * 机构类型（0：管理机构、1：XX机构）
   */
  type: string;

  /**
   * 显示顺序
   */
  orderNum?: number;

  /**
   * 园区编码
   */
  campusCode?: string;

  /**
   * 院区名称
   */
  campusName?: string;

  /**
   * 详细地址
   */
  address?: string;

  /**
   * 互认标签列表
   */
  labels?: string;
}
