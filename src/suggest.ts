export default `
type Formula = string;
type Sort = string;
declare enum IOpenSegmentType {
    Text = "text",
    Url = "url",
    Mention = "mention"
}
declare enum OpenMentionTypeMap {
    User = 0,
    Doc = 1,
    Folder = 2,
    Sheet = 3,
    SheetDoc = 4,
    Chat = 5,
    Bitable = 8,
    Mindnote = 11,
    Box = 12,
    Slide = 15,
    Wiki = 16,
    Docx = 22,
    Slides = 30,
    Bitable_Ind = 108
}
/** mention 类型，区分不同类型的飞书云文档或者飞书用户 */
type OpenMentionType = keyof typeof OpenMentionTypeMap;
/** 普通文本 */
type IOpenTextSegment = {
    type: IOpenSegmentType.Text;
    text: string;
};
/** 链接 */
type IOpenUrlSegment = {
    type: IOpenSegmentType.Url;
    text: string;
    link: string;
};
/** 多行文本中「飞书云文档链接」或「@飞书成员」的类型 */
interface IOpenMentionSegment {
    type: IOpenSegmentType.Mention;
    mentionType: OpenMentionType;
    text: string;
    token: string;
}
/** 多行文本中「@飞书成员」的类型 */
interface IOpenUserMentionSegment extends IOpenMentionSegment {
    mentionType: 'User';
    name: string;
    enName?: string;
    /** 用户 id */
    id: string;
    /** @deprecated */
    en_name?: string;
}
/** 多行文本中「飞书云文档链接」的类型 */
interface IOpenDocumentMentionSegment extends IOpenMentionSegment {
    mentionType: Exclude<OpenMentionType, 'User'>;
    link: string;
}
/** 「多行文本」字段单元格类型 */
type IOpenSegment = IOpenTextSegment | IOpenUrlSegment | IOpenUserMentionSegment | IOpenDocumentMentionSegment;
/** 「单向关联」/「双向关联」字段单元格类型 */
type IOpenLink = {
    text: string;
    /** 暂时只支持 "text" */
    type: string;
    recordIds: string[];
    tableId: string;
    /** @deprecated */
    record_ids: string[];
    /** @deprecated */
    table_id: string;
};
/** 「单选」字段单元格类型 */
type IOpenSingleSelect = {
    id: string;
    text: string;
};
/** 「多选」字段单元格类型 */
type IOpenMultiSelect = IOpenSingleSelect[];
/** 「人员」 / 「创建人」 / 「修改人」字段单元格类型 */
type IOpenUser = {
    id: string;
    name?: string;
    enName?: string;
    email?: string;
    /** @deprecated */
    en_name?: string;
};
/** 「地理位置」字段单元格类型 */
type IOpenLocation = {
    address: string;
    adname: string;
    cityname: string;
    /** 简短地址 */
    name: string;
    /** 省 */
    pname: string;
    /** 完整地址 */
    fullAddress: string;
    /** "number,number" */
    location: string;
    /** @deprecated */
    full_address: string;
};
/** 「附件」字段单元格类型（多值） */
type IOpenAttachment = {
    name: string;
    size: number;
    type: string;
    token: string;
    timeStamp: number;
};
/** 「日期」/「修改时间」/「创建时间」字段单元格类型，毫秒时间戳 */
type IOpenTimestamp = number;
/** 「数字」字段单元格类型 */
type IOpenNumber = number;
/** 「复选框」字段单元格类型 */
type IOpenCheckbox = boolean;
/** 「自动编号」字段单元格类型 */
type IOpenAutoNumber = string;
/** 「电话号码」字段单元格类型 */
type IOpenPhone = string;
/** 「群字段」字段单元格类型 */
type IOpenGroupChat = {
    id: string;
    name: string;
    avatarUrl: string;
    enName?: string;
    linkToken?: string;
    /** @deprecated */
    en_name?: string;
};
/** 字段单值 */
type IOpenSingleCellValue = IOpenSingleSelect | IOpenUser | IOpenTimestamp | IOpenNumber | IOpenCheckbox | IOpenAutoNumber | IOpenPhone | IOpenLocation | IOpenAttachment | IOpenSegment | IOpenUrlSegment | IOpenGroupChat | IOpenLink;
type IOpenFormulaProxyCellValue = IOpenSingleCellValue[] | null;
type IOpenFormulaFuncCellValue = IOpenSegment[] | number[] | number | string;
/** 公式字段出值结果 */
type IOpenFormulaCellValue = IOpenFormulaProxyCellValue | IOpenFormulaFuncCellValue;
/** 单元格联合类型，使用时建议使用 checkers 断言这个类型的数据 */
type IOpenCellValue = null | IOpenSingleSelect | IOpenMultiSelect | IOpenUser[] | IOpenTimestamp | IOpenNumber | IOpenCheckbox | IOpenAutoNumber | IOpenPhone | IOpenLocation | IOpenAttachment[] | IOpenSegment[] | IOpenUrlSegment[] | IOpenLink | IOpenGroupChat[] | IOpenFormulaCellValue;

interface IEventCbCtx<DataType = unknown> {
    data: DataType;
}
declare enum WidgetBaseEvent {
    TableAdd = "TableAdd",
    TableDelete = "TableDelete",
    SelectionChange = "SelectionChange",
    PermissionChange = "PermissionChange",
    UploadStatusChange = "UploadStatusChange"
}
declare enum WidgetFieldEvent {
}
declare enum WidgetTableEvent {
    FieldAdd = "FieldAdd",
    FieldDelete = "FieldDelete",
    FieldModify = "FieldModify",
    RecordAdd = "RecordAdd",
    RecordModify = "RecordModify",
    RecordDelete = "RecordDelete"
}
declare enum BridgeEvent {
    DataChange = "DataChange",
    ThemeChange = "ThemeChange"
}

interface Selection {
    baseId: string | null;
    tableId: string | null;
    viewId: string | null;
    fieldId: string | null;
    recordId: string | null;
}

/**
 * copy from bitable-sdk
 */
declare enum FieldType {
    NotSupport = 0,
    Text = 1,
    Number = 2,
    SingleSelect = 3,
    MultiSelect = 4,
    DateTime = 5,
    Checkbox = 7,
    User = 11,
    Phone = 13,
    Url = 15,
    Attachment = 17,
    SingleLink = 18,
    Lookup = 19,
    Formula = 20,
    DuplexLink = 21,
    Location = 22,
    GroupChat = 23,
    Denied = 403,
    /**
     * 引用类型字段，前后端约定用10xx公共前缀开头
     */
    CreatedTime = 1001,
    ModifiedTime = 1002,
    CreatedUser = 1003,
    ModifiedUser = 1004,
    AutoNumber = 1005,
    Barcode = 99001,
    Progress = 99002,
    Currency = 99003,
    Rating = 99004
}
declare enum ViewType {
    NotSupport = 0,
    Grid = 1,
    Kanban = 2,
    Form = 3,
    Gallery = 4,
    Gantt = 5,
    Hierarchy = 6,
    Calendar = 7,
    WidgetView = 100
}
declare enum UploadFileTaskStatus {
    Pending = 1,
    Inflight = 2,
    Success = 3,
    Error = 4,
    Paused = 5
}
type IUploadFileTaskItem = {
    uploadedSize: number;
    name: string;
    status: UploadFileTaskStatus;
    progress: number;
    uuid: string;
    token?: string;
    size: number;
    file: File;
};
type IUploadFileTask = {
    list: Array<IUploadFileTaskItem>;
};
type IUploadEventData = {
    data: {
        id: string;
        tasks: IUploadFileTask;
    };
};
type Locale = 'zh-CN' | 'zh-TW' | 'zh-HK' | 'en-US' | 'ja-JP' | 'fr-FR' | 'hi-IN' | 'id-ID' | 'it-IT' | 'ko-KR' | 'pt-BR' | 'ru-RU' | 'th-TH' | 'vi-VN' | 'de-DE' | 'es-ES';
type Language = 'zh' | 'zh-TW' | 'zh-HK' | 'en' | 'ja' | 'fr' | 'hi' | 'id' | 'it' | 'ko' | 'pt' | 'ru' | 'th' | 'vi' | 'de' | 'es';
/** 定位字段输入方式 **/
declare enum ELocationInputType {
    ONLY_MOBILE = "ONLY_MOBILE",
    NOT_LIMIT = "NOT_LIMIT"
}
declare enum NumberFormatter {
    INTEGER = "0",
    DIGITAL_ROUNDED_1 = "0.0",
    DIGITAL_ROUNDED_2 = "0.00",
    DIGITAL_ROUNDED_3 = "0.000",
    DIGITAL_ROUNDED_4 = "0.0000",
    DIGITAL_THOUSANDS = "1,000",
    DIGITAL_THOUSANDS_DECIMALS = "1,000.00",
    PERCENTAGE_ROUNDED = "0%",
    PERCENTAGE = "0.00%"
}
declare enum CurrencyFormatter {
    CYN_ROUNDED = "\u00A5#,##0",
    CYN = "\u00A5#,##0.00",
    DOLLAR_ROUNDED = "$#,##0",
    DOLLAR = "$#,##0.00"
}
declare enum DateFormatter {
    DATE_YMD_WITH_SLASH = "yyyy/MM/dd",
    DATE_TIME = "yyyy/MM/dd HH:mm",
    DATE_TIME_WITH_HYPHEN = "yyyy-MM-dd HH:mm",
    DATE_YMD_WITH_HYPHEN = "yyyy-MM-dd",
    DATE_MD_WITH_HYPHEN = "MM-dd",
    DATE_MMDD_WITH_SLASH = "MM/dd/yyyy",
    DATE_DDMM_WITH_SLASH = "dd/MM/yyyy"
}
declare enum CurrencyCode {
    CNY = "CNY",
    USD = "USD",
    EUR = "EUR",
    GBP = "GBP",
    AED = "AED",
    AUD = "AUD",
    BRL = "BRL",
    CAD = "CAD",
    CHF = "CHF",
    HKD = "HKD",
    INR = "INR",
    IDR = "IDR",
    JPY = "JPY",
    KRW = "KRW",
    MOP = "MOP",
    MXN = "MXN",
    MYR = "MYR",
    PHP = "PHP",
    PLN = "PLN",
    RUB = "RUB",
    SGD = "SGD",
    THB = "THB",
    TRY = "TRY",
    TWD = "TWD",
    VND = "VND"
}
declare enum RatingIconType {
    STAR = "star",
    HEART = "heart",
    THUMBSUP = "thumbsup",
    FIRE = "fire",
    SMILE = "smile",
    LIGHTNING = "lightning",
    FLOWER = "flower",
    NUMBER = "number"
}

declare abstract class ApiModule<C extends unknown[]> {
    context: C;
    /** 直接返回 string，不能引用 this，这里会被 register 从 prototype 上调用 */
    abstract getModuleName(): string;
    /**
     * @deprecated
     * 绑定 ApiModule 实例上下文并返回新实例
     *
     * @param context
     * @returns
     */
    withContext(context: C): this;
    /**
     * 获取 ApiModule 上下文
     * @returns
     */
    getContext(): C;
}

type BridgeModuleContext = never[];
declare enum ThemeModeType {
    LIGHT = "LIGHT",
    DARK = "DARK"
}
type ThemeModeCtx = {
    theme: ThemeModeType;
};
type HostMeta = {
    origin: string;
};
type Product = 'lark' | 'feishu';
interface Env {
    product: Product;
}
type GetBitableUrlOptions = Pick<Required<Selection>, 'tableId' | 'viewId'> & Pick<Selection, 'recordId' | 'fieldId'>;
interface ICommonBridgeModule {
    /** 读取持久化数据 */
    getData(): Promise<unknown>;
    /**
     * 写入持久化数据
     * @param data 可序列化的数据
     */
    setData(data: Record<string, unknown>): Promise<void>;
    /**
     * 生成 bitable 链接
     * @param options tableId, viewId 必选，recordId 可选。recordId 为空时打开表格，不为空时打开卡片。
     */
    getBitableUrl(options: GetBitableUrlOptions): Promise<string>;
    getUserId(): Promise<string>;
    getTheme(): Promise<ThemeModeType>;
    getLocale(): Promise<Locale>;
    getLanguage(): Promise<Language>;
    getTenantKey(): Promise<string>;
    getEnv(): Promise<Env>;
    getInstanceId(): Promise<string>;
}
interface ICommonBridgeModuleInner {
    registerBridgeEvent(event: BridgeEvent): Promise<void>;
    unregisterBridgeEvent(event: BridgeEvent): Promise<void>;
}
interface ICommonBridgeExtra {
    onThemeChange(callback: (ev: IEventCbCtx<ThemeModeCtx>) => void): () => void;
}
type ICommonBridge = ICommonBridgeModule & ICommonBridgeExtra;

declare enum PermissionEntity {
    Base = "Base",
    Table = "Table",
    Record = "Record",
    Field = "Field",
    Cell = "Cell"
}
declare enum OperationType {
    Visible = "visible",
    Editable = "editable",
    Addable = "addable",
    Deletable = "deletable",
    Copyable = "copyable",
    Movable = "movable",
    Printable = "printable",
    Manageable = "manageable",
    Submittable = "submittable"
}
type BaseOperation = OperationType.Editable | OperationType.Manageable | OperationType.Copyable | OperationType.Printable;
type TableOperation = OperationType.Addable | OperationType.Deletable | OperationType.Editable | OperationType.Visible | OperationType.Movable | OperationType.Copyable;
type RecordOperation = TableOperation;
type FieldOperation = TableOperation | OperationType.Submittable;
type CellOperation = TableOperation;
interface BasePermissionParams {
    entity: PermissionEntity.Base;
    type: BaseOperation;
}
interface TablePermissionParams {
    entity: PermissionEntity.Table;
    param: {
        tableId?: string;
    };
    type: TableOperation;
}
interface RecordPermissionParams {
    entity: PermissionEntity.Record;
    param: {
        tableId: string;
        recordId?: string;
    };
    type: RecordOperation;
}
interface FieldPermissionParams {
    entity: PermissionEntity.Field;
    param: {
        tableId: string;
        fieldId?: string;
    };
    type: FieldOperation;
}
interface CellPermissionParams {
    entity: PermissionEntity.Cell;
    param: {
        tableId: string;
        recordId?: string;
        fieldId?: string;
    };
    type: CellOperation;
}
type GetPermissionParams = BasePermissionParams | TablePermissionParams | RecordPermissionParams | FieldPermissionParams | CellPermissionParams;

type ITextFieldProperty = null;
interface ITextFieldMeta extends IBaseFieldMeta {
    type: FieldType.Text;
    property: ITextFieldProperty;
}
interface ITextFieldConfig extends IBaseFieldConfig {
    type: FieldType.Text;
    property?: ITextFieldProperty;
}
interface IDocumentMentionConfig {
    /** 传入的url为feishu文档类型将会被自动解析 */
    type: IOpenSegmentType.Mention;
    link: string;
    text?: string;
}

type IBaseFieldDescription = {
    content: null | (IOpenTextSegment | IOpenUrlSegment | IOpenDocumentMentionSegment)[];
    /** 是否禁止同步，如果为true，表示禁止同步该描述内容到表单的问题描述（只在新增、修改字段时生效）; 默认false */
    disableSyncToFormDesc?: boolean;
};
type IFieldDescDocumentMentionConfig = IDocumentMentionConfig;
type IFieldDescriptionContent = null | string | (IOpenTextSegment | IOpenUrlSegment | IFieldDescDocumentMentionConfig)[];

interface IBaseFieldMeta {
    id: string;
    type: FieldType;
    name: string;
    isPrimary: boolean;
    description: IBaseFieldDescription;
}
/** 修改/设置字段属性 */
interface IBaseFieldConfig {
    name?: string;
    description?: {
        content?: IFieldDescriptionContent;
        /** 是否禁止同步，如果为true，表示禁止同步该描述内容到表单的问题描述（只在新增、修改字段时生效）; 默认false */
        disableSyncToFormDesc?: boolean;
    };
}

interface IAttachmentFieldProperty {
    onlyMobile: boolean;
}
interface IAttachmentFieldMeta extends IBaseFieldMeta {
    type: FieldType.Attachment;
    property: IAttachmentFieldProperty;
}
interface IAttachmentFieldConfig extends IBaseFieldConfig {
    type: FieldType.Attachment;
    property?: Partial<IAttachmentFieldProperty>;
}

type IAutoNumberFieldProperty = null;
interface IAutoNumberFieldMeta extends IBaseFieldMeta {
    type: FieldType.AutoNumber;
    property: IAutoNumberFieldProperty;
}
interface IAutoNumberFieldConfig extends IBaseFieldConfig {
    type: FieldType.AutoNumber;
    property?: IAutoNumberFieldProperty;
}

interface IBarCodeFieldProperty {
    onlyMobile: boolean;
}
interface IBarcodeFieldMeta extends IBaseFieldMeta {
    type: FieldType.Barcode;
    property: IBarCodeFieldProperty;
}
interface IBarCodeFieldConfig extends IBaseFieldConfig {
    type: FieldType.Barcode;
    property?: Partial<IBarCodeFieldProperty>;
}

interface IButtonFieldProperty {
    color: number;
    title: string;
}
interface IButtonUserFieldMeta extends IBaseFieldMeta {
    type: FieldType;
    property: IButtonFieldProperty;
}
interface IButtonUserFieldConfig extends IBaseFieldConfig {
    type: FieldType.Barcode;
    property?: Partial<IButtonFieldProperty>;
}

type ICheckboxFieldProperty = null;
interface ICheckboxFieldMeta extends IBaseFieldMeta {
    type: FieldType.Checkbox;
    property: ICheckboxFieldProperty;
}
interface ICheckboxFieldConfig extends IBaseFieldConfig {
    type: FieldType.Checkbox;
    property?: ICheckboxFieldProperty;
}

interface ICommonLinkFieldProperty {
    tableId: string;
    multiple: boolean;
}

type ISingleLinkFieldProperty = ICommonLinkFieldProperty;
interface ISingleLinkFieldMeta extends IBaseFieldMeta {
    type: FieldType.SingleLink;
    property: ISingleLinkFieldProperty;
}
interface ISingleLinkFieldConfig extends IBaseFieldConfig {
    type: FieldType.SingleLink;
    property: {
        tableId: string;
        multiple?: boolean;
    };
}

declare enum SelectOptionsType {
    STATIC = 0,
    DYNAMIC = 1
}
interface ISelectFieldOption {
    id: string;
    name: string;
    color: number;
}
interface ICommonSelectFieldProperty {
    options: ISelectFieldOption[];
    optionsType: SelectOptionsType;
}
interface ISingleSelectFieldMeta extends IBaseFieldMeta {
    type: FieldType.SingleSelect;
    property: ICommonSelectFieldProperty;
}
interface IMultiSelectFieldMeta extends IBaseFieldMeta {
    type: FieldType.MultiSelect;
    property: ICommonSelectFieldProperty;
}
interface ISelectFieldConfig extends IBaseFieldConfig {
    type: FieldType.SingleSelect | FieldType.MultiSelect;
    property?: {
        options: (Partial<ISelectFieldOption>)[];
        optionsType?: SelectOptionsType;
    };
}

type IDuplexLinkFieldProperty = ICommonLinkFieldProperty;
interface IDuplexLinkFieldMeta extends IBaseFieldMeta {
    type: FieldType.DuplexLink;
    property: IDuplexLinkFieldProperty;
}
interface IDuplexLinkFieldConfig extends IBaseFieldConfig {
    type: FieldType.DuplexLink;
    property: {
        tableId: string;
        multiple?: boolean;
    };
}

interface ICommonTimeFieldProperty {
    dateFormat: DateFormatter;
    displayTimeZone: boolean;
}

interface IDateTimeFieldProperty extends ICommonTimeFieldProperty {
    autoFill: boolean;
}
interface IDateTimeFieldMeta extends IBaseFieldMeta {
    type: FieldType.DateTime;
    property: IDateTimeFieldProperty;
}
interface IDateTimeFieldConfig extends IBaseFieldConfig {
    type: FieldType.DateTime;
    property?: Partial<IDateTimeFieldProperty>;
}

interface ICurrencyFieldProperty {
    decimalDigits: number;
    currencyCode: CurrencyCode;
}
interface ICurrencyFieldMeta extends IBaseFieldMeta {
    type: FieldType.Currency;
    property: ICurrencyFieldProperty;
}
interface ICurrencyFieldConfig extends IBaseFieldConfig {
    type: FieldType.Currency;
    property?: Partial<ICurrencyFieldProperty>;
}

type IFormulaFieldProperty = null;
interface IFormulaFieldMeta extends IBaseFieldMeta {
    type: FieldType.Formula;
    property: IFormulaFieldProperty;
}
interface IFormulaFieldConfig extends IBaseFieldConfig {
    type: FieldType.Formula;
    property?: Partial<IFormulaFieldProperty>;
}

interface IGroupChatFieldProperty {
    multiple: boolean;
}
interface IGroupChatFieldMeta extends IBaseFieldMeta {
    type: FieldType.GroupChat;
    property: IGroupChatFieldProperty;
}
interface IGroupChatFieldConfig extends IBaseFieldConfig {
    type: FieldType.GroupChat;
    property?: Partial<IGroupChatFieldProperty>;
}

interface ILocationFieldProperty {
    inputType: ELocationInputType;
}
interface ILocationFieldMeta extends IBaseFieldMeta {
    type: FieldType.Location;
    property: ILocationFieldProperty;
}
interface ILocationFieldConfig extends IBaseFieldConfig {
    type: FieldType.Location;
    property?: Partial<ILocationFieldProperty>;
}

type ILookupFieldProperty = null;
interface ILookupFieldMeta extends IBaseFieldMeta {
    type: FieldType.Lookup;
    property: ILookupFieldProperty;
}
interface ILookupFieldConfig extends IBaseFieldConfig {
    type: FieldType.Lookup;
    property?: Partial<ILookupFieldProperty>;
}

type ICreatedTimeFieldProperty = ICommonTimeFieldProperty;
interface ICreatedTimeFieldMeta extends IBaseFieldMeta {
    type: FieldType.CreatedTime;
    property: ICreatedTimeFieldProperty;
}
interface ICreatedTimeFieldConfig extends IBaseFieldConfig {
    type: FieldType.CreatedTime;
    property?: Partial<ICreatedTimeFieldProperty>;
}

type IModifiedTimeFieldProperty = ICommonTimeFieldProperty;
interface IModifiedTimeFieldMeta extends IBaseFieldMeta {
    type: FieldType.ModifiedTime;
    property: IModifiedTimeFieldProperty;
}
interface IModifiedTimeFieldConfig extends IBaseFieldConfig {
    type: FieldType.ModifiedTime;
    property?: Partial<IModifiedTimeFieldProperty>;
}

type ICreatedUserFieldProperty = null;
interface ICreatedUserFieldMeta extends IBaseFieldMeta {
    type: FieldType.CreatedUser;
    property: ICreatedUserFieldProperty;
}
interface ICreatedUserFieldConfig extends IBaseFieldConfig {
    type: FieldType.CreatedUser;
    property?: Partial<ICreatedUserFieldProperty>;
}

type IModifiedUserFieldProperty = null;
interface IModifiedUserFieldMeta extends IBaseFieldMeta {
    type: FieldType.ModifiedUser;
    property: IModifiedUserFieldProperty;
}
interface IModifiedUserFieldConfig extends IBaseFieldConfig {
    type: FieldType.ModifiedUser;
    property?: Partial<IModifiedUserFieldProperty>;
}

interface INumberFieldProperty {
    formatter: NumberFormatter;
}
interface INumberFieldMeta extends IBaseFieldMeta {
    type: FieldType.Number;
    property: INumberFieldProperty;
}
interface INumberFieldConfig extends IBaseFieldConfig {
    type: FieldType.Number;
    property?: Partial<INumberFieldProperty>;
}

type IPhoneFieldProperty = null;
interface IPhoneFieldMeta extends IBaseFieldMeta {
    type: FieldType.Phone;
    property: IPhoneFieldProperty;
}
interface IPhoneFieldConfig extends IBaseFieldConfig {
    type: FieldType.Phone;
    property?: Partial<IPhoneFieldProperty>;
}

type IProgressFieldProperty = null;
interface IProgressFieldMeta extends IBaseFieldMeta {
    type: FieldType.Progress;
    property: IProgressFieldProperty;
}
interface IProgressFieldConfig extends IBaseFieldConfig {
    type: FieldType.Progress;
    property?: Partial<IProgressFieldProperty>;
}

type IRatingMinVal = 0 | 1;
interface IRatingFieldProperty {
    min: IRatingMinVal;
    max: number;
    rating: {
        icon: RatingIconType;
    };
}
interface IRatingFieldMeta extends IBaseFieldMeta {
    type: FieldType.Rating;
    property: IRatingFieldProperty;
}
interface IRatingFieldConfig extends IBaseFieldConfig {
    type: FieldType.Rating;
    property?: Partial<IRatingFieldProperty>;
}

type IUrlFieldProperty = null;
interface IUrlFieldMeta extends IBaseFieldMeta {
    type: FieldType.Url;
    property: IUrlFieldProperty;
}
interface IUrlFieldConfig extends IBaseFieldConfig {
    type: FieldType.Url;
    property?: IUrlFieldProperty;
}

interface IUserFieldProperty {
    multiple: boolean;
}
interface IUserFieldMeta extends IBaseFieldMeta {
    type: FieldType.User;
    property: IUserFieldProperty;
}
interface IUserFieldConfig extends IBaseFieldConfig {
    type: FieldType.User;
    property?: Partial<IUserFieldProperty>;
}

type IFieldMeta = IAttachmentFieldMeta | IAutoNumberFieldMeta | IBarcodeFieldMeta | IButtonUserFieldMeta | ICheckboxFieldMeta | ISingleLinkFieldMeta | ISingleSelectFieldMeta | IMultiSelectFieldMeta | IDuplexLinkFieldMeta | IDateTimeFieldMeta | ICurrencyFieldMeta | IFormulaFieldMeta | IGroupChatFieldMeta | ILocationFieldMeta | ILookupFieldMeta | ICreatedTimeFieldMeta | IModifiedTimeFieldMeta | ICreatedUserFieldMeta | IModifiedUserFieldMeta | INumberFieldMeta | IPhoneFieldMeta | IProgressFieldMeta | IRatingFieldMeta | ITextFieldMeta | IUrlFieldMeta | IUserFieldMeta;
type IFieldProperty = IAttachmentFieldProperty | IAutoNumberFieldProperty | IBarCodeFieldProperty | IButtonFieldProperty | ICheckboxFieldProperty | ISingleLinkFieldProperty | ICommonSelectFieldProperty | IDuplexLinkFieldProperty | IDateTimeFieldProperty | ICurrencyFieldProperty | IFormulaFieldProperty | IGroupChatFieldProperty | ILocationFieldProperty | ILookupFieldProperty | ICreatedTimeFieldProperty | IModifiedTimeFieldProperty | ICreatedUserFieldProperty | IModifiedUserFieldProperty | INumberFieldProperty | IPhoneFieldProperty | IProgressFieldProperty | IRatingFieldProperty | ITextFieldProperty | IUrlFieldProperty | IUserFieldProperty;
type IFieldConfig = IAttachmentFieldConfig | IAutoNumberFieldConfig | IBarCodeFieldConfig | IButtonUserFieldConfig | ICheckboxFieldConfig | ISingleLinkFieldConfig | ISelectFieldConfig | IDuplexLinkFieldConfig | IDateTimeFieldConfig | ICurrencyFieldConfig | IFormulaFieldConfig | IGroupChatFieldConfig | ILocationFieldConfig | ILookupFieldConfig | ICreatedTimeFieldConfig | IModifiedTimeFieldConfig | ICreatedUserFieldConfig | IModifiedUserFieldConfig | INumberFieldConfig | IPhoneFieldConfig | IProgressFieldConfig | IRatingFieldConfig | ITextFieldConfig | IUrlFieldConfig | IUserFieldConfig;
type IAddFieldConfig = IFieldConfig;
type ISetFieldConfig = Partial<IFieldConfig>;
type FieldId = string;
type IFieldRes = FieldId;

type IRecordValue = {
    fields: {
        [fieldId: string]: IOpenCellValue;
    };
};
interface IRecord {
    recordId: string;
    fields: {
        [fieldId: string]: IOpenCellValue;
    };
}
type RecordId = string;
type IRecordRes = RecordId;
interface IGetRecordsParams {
    pageSize?: number;
    pageToken?: RecordId;
    filter?: string;
    sort?: string;
    viewId?: string;
}
interface IGetRecordsResponse {
    total: number;
    hasMore: boolean;
    records: IRecord[];
    pageToken?: string;
}

type IBaseViewProperty = object;
interface IBaseViewMeta {
    id: string;
    name: string;
    type: ViewType;
    property: IBaseViewProperty;
}
/** 表格视图配置 */
interface IGridViewProperty extends IBaseViewProperty {
    hierarchyConfig: {
        fieldId: string | undefined;
    };
}
/** 看板视图层级配置 */
type IKanbanViewProperty = IBaseViewProperty;
/** 表单视图层级配置 */
type IFormViewProperty = IBaseViewProperty;
/** 画册视图层级配置 */
type IGalleryViewProperty = IBaseViewProperty;
/** 甘特视图层级配置 */
type IGanttViewProperty = IBaseViewProperty;
/** 层级视图层级配置 */
type IHierarchyViewProperty = IBaseViewProperty;
/** 日历视图层级配置 */
type ICalendarViewProperty = IBaseViewProperty;
/** 插件视图层级配置 */
type IWidgetViewProperty = IBaseViewProperty;
interface IGridViewMeta extends IBaseViewMeta {
    property: IGridViewProperty;
}
interface IKanbanViewMeta extends IBaseViewMeta {
    property: IKanbanViewProperty;
}
interface IFormViewMeta extends IBaseViewMeta {
    property: IFormViewProperty;
}
interface IGalleryViewMeta extends IBaseViewMeta {
    property: IGalleryViewProperty;
}
interface IGanttViewMeta extends IBaseViewMeta {
    property: IGanttViewProperty;
}
interface IHierarchyViewMeta extends IBaseViewMeta {
    property: IHierarchyViewProperty;
}
interface ICalendarViewMeta extends IBaseViewMeta {
    property: ICalendarViewProperty;
}
interface IWidgetViewMeta extends IBaseViewMeta {
    property: IWidgetViewProperty;
}
type IViewMeta = IGridViewMeta | IKanbanViewMeta | IFormViewMeta | IGalleryViewMeta | IGanttViewMeta | IHierarchyViewMeta | ICalendarViewMeta | IWidgetViewMeta;

type ViewId = string;
interface IAddViewConfig {
    name?: string;
    type: ViewType;
}
interface IAddViewResult {
    viewId: string;
    index: number;
}
interface ISetViewConfig {
    name?: string;
}

/** [tableId, fieldId] */
type WidgetFieldContext = [string, string];
interface IFieldValue {
    record_id: string;
    value: IOpenCellValue;
}
interface IUndefinedFieldValue {
    record_id: undefined;
    value: undefined;
}
interface IWidgetFieldModule {
    /** 获取字段名 */
    getName(): Promise<string>;
    /** 获取字段类型 */
    getType(): Promise<FieldType>;
    /** 获取公式代理列类型 */
    getProxyType(): Promise<FieldType | void>;
    /** 获取 cellValue 并转化为 string 格式 */
    getCellString(recordId: string): Promise<string>;
    /** 获取当前 field meta 信息 */
    getMeta(): Promise<IFieldMeta>;
    /**
     * 获取整列 cellValue
     * @param filter Bitable Foumula
     * @param sort Bitable Foumula
     */
    getFieldValueList(filter?: Formula, sort?: Sort): Promise<(IFieldValue | IUndefinedFieldValue)[]>;
}
interface IWidgetFieldModuleInner {
    /**
     * 注册 field 事件，注册后 host 将会向 client 转发相关事件
     *
     * client 对任何一个事件最多有一个监听
     */
    registerFieldEvent(event: WidgetFieldEvent): Promise<void>;
    /**
     * 取消注册 field 事件，取消注册后 host 将停止向 client 转发相关事件
     *
     * client 对任何一个事件最多有一个监听
     */
    unregisterFieldEvent(event: WidgetFieldEvent): Promise<void>;
}
interface IWidgetFieldExtra {
    id: string;
    tableId: string;
}
type IWidgetField = IWidgetFieldModule & IWidgetFieldExtra;

/** [tableId, viewId] */
type WidgetViewContext = [string, string];
interface IWidgetViewModule {
    /** 获取字段名 */
    getName(): Promise<string>;
    /** 获取视图类型 */
    getType(): Promise<ViewType>;
    /** 获取视图元数据 */
    getMeta(): Promise<IViewMeta>;
    /** 获取字段列表（有序） */
    getFieldMetaList(): Promise<IFieldMeta[]>;
    /** 获取记录 ID 列表 */
    getVisibleRecordIdList(): Promise<(string | undefined)[]>;
    /** 获取可见字段 ID 列表 */
    getVisibleFieldIdList(): Promise<string[]>;
    /** 获取指定记录的子记录 id 列表, undefined 则表示该记录无子记录 */
    getChildRecordIdList(parentRecordId: string): Promise<RecordId[] | undefined>;
}
interface IWidgetViewModuleInner {
}
interface IWidgetViewExtra {
    id: string;
    tableId: string;
}
type IWidgetView = IWidgetViewModule & IWidgetViewExtra;

/** [tableId] */
type WidgetTableContext = [string];
interface IWidgetTableModule {
    /** 获取表名 */
    getName(): Promise<string>;
    /** 添加字段 */
    addField(fieldConfig: IAddFieldConfig): Promise<IFieldRes>;
    /** 删除字段 */
    deleteField(fieldId: string): Promise<boolean>;
    /** 修改字段 */
    setField(fieldId: string, fieldConfig: ISetFieldConfig): Promise<IFieldRes>;
    /** 获取某个 field 元信息 */
    getFieldMetaById(fieldId: string): Promise<IFieldMeta>;
    /** 获取所有 field 元信息 */
    getFieldMetaList(): Promise<IFieldMeta[]>;
    /** 字段是否存在 */
    isFieldExist(fieldId: string): Promise<boolean>;
    /** 添加视图（目前支持设置视图 name） */
    addView(config: IAddViewConfig): Promise<IAddViewResult>;
    /** 设置视图（目前支持设置视图 name） */
    setView(viewId: string, config: ISetViewConfig): Promise<ViewId>;
    /** 删除视图 */
    deleteView(viewId: string): Promise<boolean>;
    /** 获取某个视图元信息 */
    getViewMetaById(viewId: string): Promise<IViewMeta>;
    /** 获取所有 视图 元信息 */
    getViewMetaList(): Promise<IViewMeta[]>;
    /** 视图是否存在 */
    isViewExist(viewId: string): Promise<boolean>;
    /** 通过 recordId 获取指定记录 */
    getRecordById(recordId: string): Promise<IRecordValue>;
    /**
     * 批量获取 record，单次上限 500 条
     * @param param
     *  - @property pageSize: 获取数量，默认 500，最大不得超过 500
     *  - @property pageToken: 分页标记，第一次请求不填，表示从头开始遍历；分页查询结果还有更多项时会同时返回新的 page_token，下次遍历可采用该 page_token 获取查询结果
     *  - @property filter: 过滤条件
     *  - @property sort: 排序条件
     *  - @property viewId: 获取指定视图的 record，当传入 filter/sort 时，该属性会被忽略
     */
    getRecords(param: IGetRecordsParams): Promise<IGetRecordsResponse>;
    /**
     * 获取记录分享链接
     * @param recordId string
     */
    getRecordShareLink(recordId: string): Promise<string>;
    /**
     * 获取表中所有记录 Id
     * @param filter 过滤条件
     * @param sort 排序条件
     * @returns
     */
    getRecordIdList(filter?: Formula, sort?: Sort): Promise<string[]>;
    /**
     * 获取单元格值
     * @param fieldId
     * @param recordId
     */
    getCellValue(fieldId: string, recordId: string): Promise<IOpenCellValue>;
    /**
     * 设置单元格的值
     * @param fieldId
     * @param recordId
     * @param cellValue
     */
    setCellValue<T extends IOpenCellValue = IOpenCellValue>(fieldId: string, recordId: string, cellValue: T): Promise<boolean>;
    /**
     * 获取 attachment 的 url
     * @param token
     * @param fieldId
     * @param recordId
     */
    getAttachmentUrl(token: string, fieldId?: string, recordId?: string): Promise<string>;
    /**
     * 批量获取指定单元格中的附件 url，通过 fieldId 和 recordId 指定附件所在的单元格
     * @param tokens
     * @param fieldId
     * @param recordId
     */
    getCellAttachmentUrls(tokens: string[], fieldId: string, recordId: string): Promise<string[]>;
    /**
     * 批量获取指定单元格中的附件缩略图 url，通过 fieldId 和 recordId 指定附件所在的单元格
     * @param tokens
     * @param fieldId
     * @param recordId
     */
    getCellThumbnailUrls(tokens: string[], fieldId: string, recordId: string): Promise<string[]>;
    /**
     * 增加一条记录
     * @param recordValue
     */
    addRecord(recordValue?: IRecordValue): Promise<IRecordRes>;
    /**
     * 增加多条记录，单次上限 500 条
     * @param recordValueList
     */
    addRecords(recordValueList?: IRecordValue[]): Promise<IRecordRes[]>;
    /**
     * 修改一条记录
     * @param recordId
     * @param recordValue
     */
    setRecord(recordId: string, recordValue?: IRecordValue): Promise<IRecordRes>;
    /**
     * 修改多条记录，单次上限 500 条
     * @param records
     */
    setRecords(records?: IRecord[]): Promise<IRecordRes[]>;
    /**
     * 删除一条记录
     * @param recordId
     */
    deleteRecord(recordId: string): Promise<boolean>;
    /**
     * 删除多条记录，单次上限 500 条
     * @param recordIdList
     */
    deleteRecords(recordIdList: string[]): Promise<boolean>;
    /**
     * 获取 cellValue 并转化为 string 格式
     */
    getCellString(fieldId: string, recordId: string): Promise<string>;
}
interface IWidgetTableModuleInner {
    /**
     * 通过字段名获取字段 id
     * @param name
     */
    getFieldIdByName(name: string): Promise<string>;
    /**
     * 注册 table 事件，注册后 host 将会向 client 转发相关事件
     *
     * client 对任何一个事件最多有一个监听
     */
    registerTableEvent(event: WidgetTableEvent): Promise<void>;
    /**
     * 取消注册 table 事件，取消注册后 host 将停止向 client 转发相关事件
     *
     * client 对任何一个事件最多有一个监听
     */
    unregisterTableEvent(event: WidgetTableEvent): Promise<void>;
}
interface IWidgetTableExtra {
    id: string;
    /** 获取字段列表 */
    getFieldList(): Promise<IWidgetField[]>;
    /**
     * @deprecated The method will be removed, use getFieldMetaList instead!
     */
    getFieldIdList(): Promise<string[]>;
    /**
     * 根据字段 id 获取字段
     * @param fieldId
     */
    getFieldById(fieldId: string): Promise<IWidgetField>;
    /**
     * 根据字段名称获取字段
     * @param name
     */
    getFieldByName(name: string): Promise<IWidgetField>;
    /**
     * 监听 Field 添加事件
     * @param callback 回调函数
     */
    onFieldAdd(callback: (ev: IEventCbCtx) => void): () => void;
    /**
     * 监听 Field 删除事件
     * @param callback 回调函数
     */
    onFieldDelete(callback: (ev: IEventCbCtx) => void): () => void;
    /**
     * 监听 Field 修改事件
     * @param callback 回调函数
     */
    onFieldModify(callback: (ev: IEventCbCtx) => void): () => void;
    /**
     * 监听 Record 添加事件
     * @param callback 回调函数
     */
    onRecordAdd(callback: (ev: IEventCbCtx<[recordId: string]>) => void): () => void;
    /**
     * 监听 Record 删除事件
     * @param callback 回调函数
     */
    onRecordDelete(callback: (ev: IEventCbCtx<[recordId: string]>) => void): () => void;
    /**
     * 监听 Record 修改事件
     * @param callback 回调函数
     */
    onRecordModify(callback: (ev: IEventCbCtx<{
        recordId: string;
        fieldIds: string[];
    }>) => void): () => void;
    /**
     * 根据字段 id 获取视图
     * @param viewId
     */
    getViewById(viewId: string): Promise<IWidgetView>;
}
type IWidgetTable = IWidgetTableModule & IWidgetTableExtra;

type WidgetBaseContext = never[];
interface ITableMeta {
    id: string;
    name: string;
}
interface IAddTableResult {
    tableId: string;
    index: number;
}
interface IAddTableConfig {
    name: string;
    fields: IFieldConfig[];
}
interface ISetTableConfig {
    name: string;
}
type TableId$1 = string;
interface ICommonWidgetBaseModule {
    addTable(config: IAddTableConfig): Promise<IAddTableResult>;
    setTable(tableId: string, config: ISetTableConfig): Promise<TableId$1>;
    deleteTable(tableId: string): Promise<boolean>;
    /** 读取当前 table id, field id(仅 itemview 会返回), recordId(仅 itemview 会返回) */
    getSelection(): Promise<Selection>;
    /** 获取当前 base 下所有表元信息 */
    getTableMetaList(): Promise<ITableMeta[]>;
    /**
     * 获取 Base、Table、Field、Record、Cell 等不同实体的权限
     */
    getPermission(params: GetPermissionParams): Promise<boolean>;
    /**
     * @deprecated 请使用 getPermission 方法
     * 获取当前 base 的权限信息
     * @param type 权限类型，目前支持管理/编辑/复制/打印权限的判断
     */
    getBasePermission(type: BaseOperation): Promise<boolean>;
    /**
     * 是否在编辑模式
     */
    isEditable(): Promise<boolean>;
    /**
     * @deprecated 推荐使用 batchUploadFile 方法
     * 上传文件，返回上传任务的 taskId
     * @param file
     * @return taskId
     */
    uploadFile(file: File | FileList): Promise<string>;
    /**
     * 批量上传文件，按序返回每个文件对应的 fileToken 列表
     * @param {(File[] | FileList)} files
     * @return {Promise<string[]>} fileTokens
     */
    batchUploadFile(file: File[] | FileList): Promise<string[]>;
}
interface ICommonWidgetBaseModuleInner {
    /**
     * 当前表是否存在
     */
    isTableExist(tableId: string): Promise<boolean>;
    /**
     * 通过表名获取表 id
     * @param name
     */
    getTableIdByName(name: string): Promise<string>;
    /**
     * 注册 base 事件，注册后 host 将会向 client 转发相关事件
     *
     * client 对任何一个事件最多有一个监听
     */
    registerBaseEvent(event: WidgetBaseEvent): Promise<void>;
    /**
     * 取消注册 base 事件，取消注册后 host 将停止向 client 转发相关事件
     *
     * client 对任何一个事件最多有一个监听
     */
    unregisterBaseEvent(event: WidgetBaseEvent): Promise<void>;
}
interface ICommonWidgetBaseExtra {
    /** 获取当前 base 下所有表 */
    getTableList(): Promise<IWidgetTable[]>;
    /**
     * 通过表 id 获取表
     * @param tableId
     */
    getTableById(tableId: string): Promise<IWidgetTable>;
    /**
     * 通过表名获取表
     * @param name
     */
    getTableByName(name: string): Promise<IWidgetTable>;
    /**
     * 监听 Table 添加事件
     * @param callback 回调函数
     */
    onTableAdd(callback: (e: IEventCbCtx) => void): () => void;
    /**
     * 监听 Table 删除事件
     * @param callback 回调函数
     */
    onTableDelete(callback: (e: IEventCbCtx) => void): () => void;
    /**
     * 监听选中改变事件
     * @param callback 回调函数，参数为当前选中的 base/table/field/record ID 集合
     */
    onSelectionChange(callback: (e: IEventCbCtx<Selection>) => void): () => void;
    /**
     * 监听权限变化
     * @param callback 回调函数
     */
    onPermissionChange(callback: () => void): () => void;
    /**
     * 监听上传文件的状态变化
     * @param callback
     */
    onUploadStatusChange(callback: (data: IUploadEventData) => void): () => void;
}
type ICommonWidgetBase = ICommonWidgetBaseModule & ICommonWidgetBaseExtra;

/**
 * 私有 API 模块
 */
interface IPrivateModule {
    /**
     * 设置 client 版本
     * @param version
     */
    setClientVersion(version: string): Promise<void>;
}

interface ISelectOptionColor {
    /** 颜色方案id，可用范围为0 - 54 */
    id: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54;
    /** 同css 16进制颜色值，选项的背景色
     * @example '#ff0000' 纯红色
     */
    bgColor: string;
    /** 同css 16进制颜色值，文字的颜色
     * @example '#ff0000' 纯红色
     */
    textColor: string;
    /** 同css 16进制颜色值，表格中删除选项时的x图标的颜色
     * @example '#ff0000' 纯红色
     */
    iconColor: string;
    /** 同css 16进制颜色值，表格中删除选项时的x图标hover时候的颜色
     * @example '#ff0000' 纯红色
     */
    iconAltColor: string;
}
type TableId = string;
type BlockId = TableId;
interface ICommonUIModule {
    getSelectOptionColorInfoList(): Promise<ISelectOptionColor[]>;
    switchBlock(blockId: BlockId): Promise<boolean>;
}
interface ICommonUIModuleInner {
}
interface ICommonUIExtra {
}
type ICommonUI = ICommonUIModule & ICommonUIExtra;

/**
 * 调试接口的时候可能看到 c 和 p 比较迷惑，这里主要是为了节省传输开销
 * 在 10000 行 getCellValue 测试中，使用短名称优化可以提高 2% 的性能
 */
interface TransferType {
    /**
     * 指 context，为了节省传输开销所以用 c 简写
     *
     * 推荐使用数组，暂时为了风格统一强制指定为数组
     */
    c: unknown[];
    /**
     * 指 params ，为了节省传输开销所以用 p 简写，参数会被直接 apply 给 host 上的函数
     */
    p: unknown[];
}

type IFieldExtends = IWidgetField & ApiModule<WidgetFieldContext>;
interface IField<V extends ICellTransformVal = any, R extends IOpenCellValue = any, TV extends R | Promise<R> = any> extends IFieldExtends {
    transform: (val: V) => TV;
    createCell: (val: V) => Promise<ICell<V, R>>;
    getCell: (recordOrId: IRecordType | string) => Promise<ICell<V, R>>;
    getEditable: () => boolean;
    setValue: (recordOrId: IRecordType | string, val: V) => Promise<boolean>;
    getValue: (recordOrId: IRecordType | string) => Promise<R>;
}
type OptionConfig = {
    name?: string;
    color?: number;
};
type AttachmentTransformVal = File | File[] | FileList | IOpenAttachment | IOpenAttachment[];
interface IAttachmentField extends IField<AttachmentTransformVal, IOpenAttachment[], Promise<IOpenAttachment[]>> {
    getAttachmentThumbnailUrls: (recordOrId: IRecordType | string) => Promise<string[]>;
    getAttachmentUrls: (recordOrId: IRecordType | string) => Promise<string[]>;
    setOnlyMobile: (onlyMobile: boolean) => Promise<IFieldRes>;
    getOnlyMobile: () => Promise<boolean>;
}
type AutonumberTransformVal = number | IOpenAutoNumber;
interface IAutonumberField extends IField<AutonumberTransformVal, IOpenAutoNumber, IOpenAutoNumber> {
}
type BarcodeTransformVal = string | IOpenTextSegment[] | IOpenTextSegment;
interface IBarcodeField extends IField<BarcodeTransformVal, IOpenTextSegment[], IOpenTextSegment[]> {
    setOnlyMobile: (onlyMobile: boolean) => Promise<IFieldRes>;
    getOnlyMobile: () => Promise<boolean>;
}
type CheckBoxTransformVal = IOpenCheckbox;
type ICheckBoxField = IField<CheckBoxTransformVal, IOpenCheckbox, IOpenCheckbox>;
type CreateUserTransformVal = null;
interface ICreateUserField extends IField<CreateUserTransformVal, IOpenUser[], IOpenUser[]> {
}
type CurrencyTransformVal = number;
interface ICurrencyField extends IField<CurrencyTransformVal, number, number> {
    setDecimalDigits: (decimalDigits: number) => Promise<IFieldRes>;
    getDecimalDigits: () => Promise<number>;
    setCurrencyCode: (currencyCode: CurrencyCode) => Promise<IFieldRes>;
    getCurrencyCode: () => Promise<CurrencyCode>;
}
type DuplexLinkTransformVal = IOpenLink;
interface IDuplexLinkField extends IField<DuplexLinkTransformVal, IOpenLink, IOpenLink> {
    setTableId: (tableId: string) => Promise<IFieldRes>;
    getTableId: () => Promise<string>;
    setMultiple: (multiple: boolean) => Promise<IFieldRes>;
    getMultiple: () => Promise<boolean>;
}
type FormulaTransformVal = IOpenFormulaCellValue;
type IFormulaField = IField<ICellTransformVal, IOpenCellValue, IOpenCellValue>;
type GroupFieldTransformVal = IOpenGroupChat[];
interface IGroupField extends IField<GroupFieldTransformVal, IOpenGroupChat[], IOpenGroupChat[]> {
    setMultiple: (multiple: boolean) => Promise<IFieldRes>;
    getMultiple: () => Promise<boolean>;
}
type LocationTransformVal = IOpenLocation;
interface ILocationField extends IField<LocationTransformVal, IOpenLocation, IOpenLocation> {
    setInputType: (inputType: ELocationInputType) => Promise<IFieldRes>;
    getInputType: () => Promise<ELocationInputType>;
}
type LookupTransformVal = IOpenFormulaCellValue;
type ILookupField = IField<LookupTransformVal, IOpenFormulaCellValue, IOpenFormulaCellValue>;
type ModifiedUserTransformVal = null;
interface IModifiedUserField extends IField<ModifiedUserTransformVal, IOpenUser[], IOpenUser[]> {
    getMultiple: () => Promise<null>;
}
type INotSupportField = IField<null, null, null>;
type NumberFieldTransformVal = IOpenNumber;
interface INumberField extends IField<NumberFieldTransformVal, IOpenNumber, IOpenNumber> {
    setFormatter: (formatter: NumberFormatter) => Promise<IFieldRes>;
    getFormatter: () => Promise<NumberFormatter>;
}
type PhoneFieldTransformVal = number | IOpenPhone;
type IPhoneField = IField<PhoneFieldTransformVal, IOpenPhone, IOpenPhone>;
type ProgressFieldTransformVal = IOpenNumber;
type IProgressField = IField<ProgressFieldTransformVal, IOpenNumber, IOpenNumber>;
type RatingTransformVal = IOpenNumber;
interface IRatingField extends IField<RatingTransformVal, IOpenNumber, IOpenNumber> {
    getMin: () => Promise<IRatingMinVal>;
    setMin: (min: IRatingMinVal) => Promise<IFieldRes>;
    getMax: () => Promise<number>;
    setMax: (max: number) => Promise<IFieldRes>;
    getRatingIcon: () => Promise<RatingIconType>;
    setRatingIcon: (icon: RatingIconType) => Promise<IFieldRes>;
}
type MultiSelectTransformVal = string[] | string | IOpenMultiSelect | IOpenSingleSelect;
interface IMultiSelectField extends ISelectField<MultiSelectTransformVal, IOpenMultiSelect, Promise<IOpenMultiSelect>> {
}
type SingleSelectTransformVal = string | IOpenSingleSelect;
interface ISingleSelectField extends ISelectField<SingleSelectTransformVal, IOpenSingleSelect, Promise<IOpenSingleSelect>> {
}
interface ISelectField<V extends MultiSelectTransformVal | SingleSelectTransformVal, R extends IOpenMultiSelect | IOpenSingleSelect, TV extends Promise<R>> extends IField<V, R, TV> {
    addOption: (name: string, color?: number) => Promise<IFieldRes>;
    addOptions: (optionList: {
        name: string;
        color?: number;
    }[]) => Promise<IFieldRes>;
    getOptions: () => Promise<ISelectFieldOption[]>;
    deleteOption: (idOrName: string) => Promise<IFieldRes>;
    setOption: (nameOrId: string, config: OptionConfig) => Promise<IFieldRes>;
    setOptionsType: (type: SelectOptionsType) => Promise<IFieldRes>;
    getOptionsType: () => Promise<SelectOptionsType>;
}
type SingleLinkFieldTransformVal = IOpenLink;
interface ISingleLinkField extends IField<SingleLinkFieldTransformVal, IOpenLink, IOpenLink> {
    setTableId: (tableId: string) => Promise<IFieldRes>;
    getTableId: () => Promise<string>;
    setMultiple: (multiple: boolean) => Promise<IFieldRes>;
    getMultiple: () => Promise<boolean>;
}
type TextFieldTransformVal = string | IOpenSegment | IOpenSegment[];
type ITextField = IField<TextFieldTransformVal, IOpenSegment[], IOpenSegment[]>;
type ModifiedTimeTransformVal = null;
interface IModifiedTimeField extends ITimeField<ModifiedTimeTransformVal> {
}
type CreateTimeTransformVal = null | undefined;
interface ICreateTimeField extends ITimeField<CreateTimeTransformVal> {
}
type DateTransformVal = IOpenTimestamp;
interface IDateTimeField extends ITimeField<DateTransformVal> {
}
interface ITimeField<V extends DateTransformVal | CreateTimeTransformVal | ModifiedTimeTransformVal> extends IField<V, IOpenTimestamp, IOpenTimestamp> {
    setDateFormat: (format: DateFormatter) => Promise<IFieldRes>;
    getDateFormat: () => Promise<DateFormatter>;
    setDisplayTimeZone: (display: boolean) => Promise<IFieldRes>;
    getDisplayTimeZone: () => Promise<boolean>;
}
type UrlTransformVal = string | IOpenUrlSegment | IOpenUrlSegment[];
type IUrlField = IField<UrlTransformVal, IOpenUrlSegment[], IOpenUrlSegment[]>;
type UserFieldTransformVal = IOpenUser | IOpenUser[];
interface IUserField extends IField<UserFieldTransformVal, IOpenUser[], IOpenUser[]> {
    getMultiple: () => Promise<boolean>;
    setMultiple: (multiple: boolean) => Promise<IFieldRes>;
}

interface IRecordType {
    id: string;
    getCellList: () => Promise<ICell[]>;
    getCellByField: (fieldOrId: IField | string) => Promise<ICell>;
}
interface IRecordList {
    getRecordById(recordId: string): IRecordType;
    [Symbol.iterator](): Generator<IRecordType>;
}

type ICellTransformVal = TextFieldTransformVal | AttachmentTransformVal | CreateTimeTransformVal | CreateUserTransformVal | GroupFieldTransformVal | LocationTransformVal | LookupTransformVal | PhoneFieldTransformVal | AutonumberTransformVal | CheckBoxTransformVal | BarcodeTransformVal | CurrencyTransformVal | NumberFieldTransformVal | MultiSelectTransformVal | ModifiedUserTransformVal | ModifiedTimeTransformVal | DuplexLinkTransformVal | FormulaTransformVal | ProgressFieldTransformVal | RatingTransformVal | UrlTransformVal | UserFieldTransformVal | DateTransformVal;
interface ICell<V extends ICellTransformVal = any, R extends IOpenCellValue = any> {
    editable: boolean;
    setValue: (val: V) => Promise<void | boolean>;
    getValue: () => Promise<R>;
    getFieldId: () => string;
    mountRecord: (record: IRecordType) => void;
}

interface IView extends IWidgetView {
    name: string;
}

interface ITable extends IWidgetTable {
    getFieldListByType: <T extends IField>(type: FieldType) => Promise<T[]>;
    getFieldMetaListByType: <T extends IFieldMeta>(type: FieldType) => Promise<T[]>;
    getRecordList: (filter?: Formula, sort?: Sort) => Promise<IRecordList>;
    getFieldByName: <T extends IField>(name: string) => Promise<T>;
    getField: <T extends IField>(idOrName: string) => Promise<T>;
    getFieldById: <T extends IField>(id: string) => Promise<T>;
    getFieldList: <T extends IField>() => Promise<T[]>;
    getViewById: (id: string) => Promise<IView>;
    getViewList: () => Promise<IView[]>;
    addRecord: (recordVale?: IRecordValue | ICell | ICell[]) => Promise<IRecordRes>;
    addRecords: (record?: IRecordValue[] | ICell[] | Array<ICell[]>) => Promise<IRecordRes[]>;
    addRecordByCell: (cells: ICell[]) => Promise<IRecordRes>;
    addRecordsByCell: (cells: Array<ICell[]>) => Promise<IRecordRes[]>;
    deleteField: (fieldOrId: string | IField) => Promise<boolean>;
}

interface IBase extends ICommonWidgetBase {
    getTable: (idOrName: string) => Promise<ITable>;
    getTableByName: (name: string) => Promise<ITable>;
    getTableById: (id: string) => Promise<ITable>;
    getTableList: () => Promise<ITable[]>;
    getActiveTable: () => Promise<ITable>;
}

declare const baseEventPrefix = "BaseEvent";
declare const tableEventPrefix = "TableEvent";
declare const fieldEventPrefix = "FieldEvent";
declare const bridgeEventPrefix = "BridgeEvent";
declare const getBaseEventKey: (eventName: WidgetBaseEvent) => string;
declare const getTableEventKey: (tableId: string, eventName: WidgetTableEvent) => string;
declare const getFieldEventKey: (tableId: string, fieldId: string, eventName: WidgetFieldEvent) => string;
declare const getBridgeEventKey: (eventName: BridgeEvent) => string;

declare function createApiKey(moduleName: string, methodName: string): string;
declare function createCompatibleApiKey(moduleName: string, methodName: string): string;
declare function getNeedTransformApiKeyMap(): {
    WidgetBase_getBasePermission: string;
    WidgetBase_registerBaseEvent: string;
    WidgetBase_getSelection: string;
    WidgetBase_isTableExist: string;
    WidgetTable_getCellValue: string;
    WidgetBase_getTableMetaList: string;
    WidgetTable_getName: string;
    WidgetTable_isFieldExist: string;
    WidgetField_getName: string;
    WidgetTable_isViewExist: string;
    WidgetView_getName: string;
    WidgetBase_getTableIdByName: string;
    WidgetBase_isEditable: string;
    WidgetBase_unregisterBaseEvent: string;
    WidgetBase_uploadFile: string;
    WidgetTable_getFieldMetaById: string;
    WidgetTable_getFieldMetaList: string;
    WidgetTable_getViewMetaById: string;
    WidgetTable_getViewMetaList: string;
    WidgetTable_getFieldIdByName: string;
    WidgetTable_getRecordIdList: string;
    WidgetTable_setCellValue: string;
    WidgetTable_addRecord: string;
    WidgetTable_setRecord: string;
    WidgetTable_deleteRecord: string;
    WidgetTable_registerTableEvent: string;
    WidgetTable_unregisterTableEvent: string;
    WidgetTable_getAttachmentUrl: string;
    WidgetField_getType: string;
    WidgetField_getMeta: string;
    WidgetField_getProxyType: string;
    WidgetField_getFieldValueList: string;
    WidgetField_registerFieldEvent: string;
    WidgetField_unregisterFieldEvent: string;
    WidgetView_getType: string;
    WidgetView_getFieldMetaList: string;
    WidgetView_getVisibleRecordIdList: string;
    WidgetBase_getTableList: string;
    WidgetBase_getTableById: string;
    WidgetBase_onTableAdd: string;
    WidgetBase_onTableDelete: string;
    WidgetBase_onSelectionChange: string;
    WidgetBase_onUploadStatusChange: string;
    WidgetTable_getFieldList: string;
    WidgetTable_getFieldById: string;
    WidgetTable_getViewById: string;
    WidgetTable_onFieldAdd: string;
    WidgetTable_onFieldDelete: string;
    WidgetTable_onFieldModify: string;
    WidgetTable_onRecordModify: string;
    WidgetTable_getCellAttachmentUrls: string;
};

declare function isUsers(value: unknown): value is IOpenUser[];
declare function isLocation(value: unknown): value is IOpenLocation;
declare function isAttachment(value: unknown): value is IOpenAttachment;
declare function isAttachments(value: unknown): value is IOpenAttachment[];
declare function isTimestamp(value: unknown): value is IOpenTimestamp;
declare function isCheckbox(value: unknown): value is IOpenCheckbox;
declare function isPhone(value: unknown): value is IOpenPhone;
declare function isAutoNumber(value: unknown): value is IOpenAutoNumber;
declare function isNumber(value: unknown): value is IOpenNumber;
declare function isSingleSelect(value: unknown): value is IOpenSingleSelect;
declare function isMultiSelect(value: unknown): value is IOpenMultiSelect;
declare function isEmpty(value: unknown): value is null;
declare function isSegmentItem(value: unknown): value is IOpenSegment;
declare function isSegments(value: unknown): value is IOpenSegment[];
declare function isLink(value: unknown): value is IOpenLink;
declare function isGroupChat(value: unknown): value is IOpenGroupChat;

declare const cell_checkers_isUsers: typeof isUsers;
declare const cell_checkers_isLocation: typeof isLocation;
declare const cell_checkers_isAttachment: typeof isAttachment;
declare const cell_checkers_isAttachments: typeof isAttachments;
declare const cell_checkers_isTimestamp: typeof isTimestamp;
declare const cell_checkers_isCheckbox: typeof isCheckbox;
declare const cell_checkers_isPhone: typeof isPhone;
declare const cell_checkers_isAutoNumber: typeof isAutoNumber;
declare const cell_checkers_isNumber: typeof isNumber;
declare const cell_checkers_isSingleSelect: typeof isSingleSelect;
declare const cell_checkers_isMultiSelect: typeof isMultiSelect;
declare const cell_checkers_isEmpty: typeof isEmpty;
declare const cell_checkers_isSegmentItem: typeof isSegmentItem;
declare const cell_checkers_isSegments: typeof isSegments;
declare const cell_checkers_isLink: typeof isLink;
declare const cell_checkers_isGroupChat: typeof isGroupChat;
declare namespace cell_checkers {
  export {
    cell_checkers_isUsers as isUsers,
    cell_checkers_isLocation as isLocation,
    cell_checkers_isAttachment as isAttachment,
    cell_checkers_isAttachments as isAttachments,
    cell_checkers_isTimestamp as isTimestamp,
    cell_checkers_isCheckbox as isCheckbox,
    cell_checkers_isPhone as isPhone,
    cell_checkers_isAutoNumber as isAutoNumber,
    cell_checkers_isNumber as isNumber,
    cell_checkers_isSingleSelect as isSingleSelect,
    cell_checkers_isMultiSelect as isMultiSelect,
    cell_checkers_isEmpty as isEmpty,
    cell_checkers_isSegmentItem as isSegmentItem,
    cell_checkers_isSegments as isSegments,
    cell_checkers_isLink as isLink,
    cell_checkers_isGroupChat as isGroupChat,
  };
}

/************************
 * Bitable 高位域（ab）码 *
 ************************/
declare const UnknownScopeCode = 0;
/**
 * 核心域点位
 * 10：未知
 */
declare const CoreScopeCode: {
    readonly Unknown: 10;
    readonly Base: 11;
    readonly Table: 12;
    readonly Field: 13;
    readonly Record: 14;
    readonly View: 15;
    readonly Cell: 16;
};
/**
 * 开放域点位
 * 80-89：FaaS 点位
 * 90-98：Widget 点位
 * 99：未知点位
 */
declare const OpenScopeCode: {
    readonly Action: 89;
    readonly ViewWidget: 96;
    readonly ItemWidget: 97;
    readonly Widget: 98;
    readonly Unknown: 99;
};
type ValueOf<T> = T[keyof T];
type CoreScopeCodeType = ValueOf<typeof CoreScopeCode>;
type OpenScopeCodeType = ValueOf<typeof OpenScopeCode>;
type ErrorScopeCodeType = typeof UnknownScopeCode | CoreScopeCodeType | OpenScopeCodeType;
/************************
 * Bitable 低位域（xyz）码 *
 ************************/
/**
 * Bitable 核心域通用错误
 */
declare const CoreCommonDetailCode: {
    /** 不支持的类型 **/
    readonly UnSupportedType: 991;
    /** 参数错误 */
    readonly ParameterException: 992;
    /** 超出下限 */
    readonly LowerLimitExceeded: 993;
    /** 超出上限 */
    readonly UpperLimitExceeded: 994;
    /** 命名重复 */
    readonly NameRepeated: 995;
    /** 不支持的操作，常见于对旧版本操作 */
    readonly NotSupported: 996;
    /** 权限拒绝 */
    readonly PermissionDenied: 997;
    /** 不存在 */
    readonly NotFound: 998;
    /** 未知错误 */
    readonly Unknown: 999;
};
/**
 * Bitable 开放域通用错误码
 */
declare const OpenCommonDetailCode: {
    /** Host 未注册 API */
    readonly HostNotRegistered: 997;
    /** 不存在 */
    readonly NotFound: 998;
    /** 未知错误 */
    readonly Unknown: 999;
};
/**
 * Bitable 低位（xyz）详情错误码
 */
declare const DetailCode: {
    readonly 11: {
        /** 不支持的类型 **/
        readonly UnSupportedType: 991;
        /** 参数错误 */
        readonly ParameterException: 992;
        /** 超出下限 */
        readonly LowerLimitExceeded: 993;
        /** 超出上限 */
        readonly UpperLimitExceeded: 994;
        /** 命名重复 */
        readonly NameRepeated: 995;
        /** 不支持的操作，常见于对旧版本操作 */
        readonly NotSupported: 996;
        /** 权限拒绝 */
        readonly PermissionDenied: 997;
        /** 不存在 */
        readonly NotFound: 998;
        /** 未知错误 */
        readonly Unknown: 999;
    };
    readonly 12: {
        /** 不支持的类型 **/
        readonly UnSupportedType: 991;
        /** 参数错误 */
        readonly ParameterException: 992;
        /** 超出下限 */
        readonly LowerLimitExceeded: 993;
        /** 超出上限 */
        readonly UpperLimitExceeded: 994;
        /** 命名重复 */
        readonly NameRepeated: 995;
        /** 不支持的操作，常见于对旧版本操作 */
        readonly NotSupported: 996;
        /** 权限拒绝 */
        readonly PermissionDenied: 997;
        /** 不存在 */
        readonly NotFound: 998;
        /** 未知错误 */
        readonly Unknown: 999;
        /** 数据表未加载完毕 */
        readonly NotLoaded: 1;
        readonly LastTableDeleteForbidden: 2;
    };
    readonly 13: {
        /** 不支持的类型 **/
        readonly UnSupportedType: 991;
        /** 参数错误 */
        readonly ParameterException: 992;
        /** 超出下限 */
        readonly LowerLimitExceeded: 993;
        /** 超出上限 */
        readonly UpperLimitExceeded: 994;
        /** 命名重复 */
        readonly NameRepeated: 995;
        /** 不支持的操作，常见于对旧版本操作 */
        readonly NotSupported: 996;
        /** 权限拒绝 */
        readonly PermissionDenied: 997;
        /** 不存在 */
        readonly NotFound: 998;
        /** 未知错误 */
        readonly Unknown: 999;
        /** 字段类型不匹配 */
        readonly NotMatch: 1;
    };
    readonly 14: {
        /** 不支持的类型 **/
        readonly UnSupportedType: 991;
        /** 参数错误 */
        readonly ParameterException: 992;
        /** 超出下限 */
        readonly LowerLimitExceeded: 993;
        /** 超出上限 */
        readonly UpperLimitExceeded: 994;
        /** 命名重复 */
        readonly NameRepeated: 995;
        /** 不支持的操作，常见于对旧版本操作 */
        readonly NotSupported: 996;
        /** 权限拒绝 */
        readonly PermissionDenied: 997;
        /** 不存在 */
        readonly NotFound: 998;
        /** 未知错误 */
        readonly Unknown: 999;
        /** 单次记录操作超出 500 条记录上限 */
        readonly SingleRecordOperationLimitExceeded: 1;
    };
    readonly 16: {
        /** 不支持的类型 **/
        readonly UnSupportedType: 991;
        /** 参数错误 */
        readonly ParameterException: 992;
        /** 超出下限 */
        readonly LowerLimitExceeded: 993;
        /** 超出上限 */
        readonly UpperLimitExceeded: 994;
        /** 命名重复 */
        readonly NameRepeated: 995;
        /** 不支持的操作，常见于对旧版本操作 */
        readonly NotSupported: 996;
        /** 权限拒绝 */
        readonly PermissionDenied: 997;
        /** 不存在 */
        readonly NotFound: 998;
        /** 未知错误 */
        readonly Unknown: 999;
    };
    readonly 15: {
        /** 不支持的类型 **/
        readonly UnSupportedType: 991;
        /** 参数错误 */
        readonly ParameterException: 992;
        /** 超出下限 */
        readonly LowerLimitExceeded: 993;
        /** 超出上限 */
        readonly UpperLimitExceeded: 994;
        /** 命名重复 */
        readonly NameRepeated: 995;
        /** 不支持的操作，常见于对旧版本操作 */
        readonly NotSupported: 996;
        /** 权限拒绝 */
        readonly PermissionDenied: 997;
        /** 不存在 */
        readonly NotFound: 998;
        /** 未知错误 */
        readonly Unknown: 999;
        readonly LastViewDeleteForbidden: 1;
    };
    readonly 97: {
        /** Host 未注册 API */
        readonly HostNotRegistered: 997;
        /** 不存在 */
        readonly NotFound: 998;
        /** 未知错误 */
        readonly Unknown: 999;
    };
    readonly 89: {
        /** Host 未注册 API */
        readonly HostNotRegistered: 997;
        /** 不存在 */
        readonly NotFound: 998;
        /** 未知错误 */
        readonly Unknown: 999;
    };
    readonly 96: {
        /** Host 未注册 API */
        readonly HostNotRegistered: 997;
        /** 不存在 */
        readonly NotFound: 998;
        /** 未知错误 */
        readonly Unknown: 999;
    };
};
/**
 * 自定义错误信息
 */
declare const DetailMessage: {
    [scopeCode in ErrorScopeCodeType]?: {
        [detailCode: number]: string;
    };
};
/** 错误码 */
declare enum OpenErrorCode {
    /** table */
    TableNotLoadedError = 10212001,
    LastTableDeleteForbiddenError = 10212002,
    TableParamExceptionError = 10212992,
    TableNameRepeatedError = 10212995,
    TablePermissionDeniedError = 10212997,
    TableNotFoundError = 10212998,
    TableUnknownError = 10212999,
    /** field */
    FieldTypeUnSupportedError = 10213991,
    FieldNameRepeatedError = 10213995,
    FieldPermissionDeniedError = 10213997,
    FieldNotFoundError = 10213998,
    FieldUnknownError = 10213999,
    /** record */
    SingleRecordOperationLimitExceeded = 10214001,
    RecordPermissionDeniedError = 10214997,
    RecordNotFoundError = 10214998,
    RecordUnknownError = 10214999,
    /** view */
    LastViewDeleteForbiddenError = 10215001,
    ViewTypeUnSupportedError = 10215991,
    ViewNameRepeatedError = 10215995,
    ViewPermissionDeniedError = 10215997,
    ViewNotFoundError = 10215998,
    ViewUnknownError = 10215999,
    /** cell */
    CellPermissionDeniedError = 10216997,
    CellUnknownError = 10216999
}

declare const BitableTransferableErrorSign = "bte";
interface TransferableError {
    e: typeof BitableTransferableErrorSign;
    /**
     * @deprecated
     */
    msg: string;
    code: number;
    message: string;
}

declare class OpenError extends Error {
    readonly code: number;
    constructor(scopeCode: ErrorScopeCodeType, detailCode: number, message?: string);
    toJSON(): TransferableError;
}

/**
 * 表不存在
 */
declare class TableNotFoundError extends OpenError {
    constructor();
}
/**
 * 表未加载完毕
 */
declare class TableNotLoadedError extends OpenError {
    constructor();
}
/**
 * 表相关操作无权限
 */
declare class TablePermissionDeniedError extends OpenError {
    constructor();
}
/**
 * 表名字重复
 */
declare class TableNameRepeatedError extends OpenError {
    constructor();
}
/**
 * 表相关操作参数异常错误
 */
declare class TableParamExceptionError extends OpenError {
    constructor();
}
/**
 * 设置数据表未知错误
 */
declare class SetTableUnknownError extends OpenError {
    constructor();
}
/**
 * 添加数据表未知错误
 */
declare class AddTableUnknownError extends OpenError {
    constructor();
}
/**
 * 删除数据表未知错误
 */
declare class DeleteTableUnknownError extends OpenError {
    constructor();
}
/**
 * 最后一张数据表禁止删除错误
 */
declare class LastTableDeleteForbiddenError extends OpenError {
    constructor();
}

/**
 * 字段不存在
 */
declare class FieldNotFoundError extends OpenError {
    constructor();
}
declare class FieldPermissionDeniedError extends OpenError {
    constructor();
}
declare class SetFieldUnknownError extends OpenError {
    constructor();
}
declare class AddFieldUnknownError extends OpenError {
    constructor();
}
declare class DeleteFieldUnknownError extends OpenError {
    constructor();
}
/**
 * 字段名字重复
 */
declare class FieldNameRepeatedError extends OpenError {
    constructor();
}
/**
 * 不支持的字段类型
 */
declare class UnSupportedFieldTypeError extends OpenError {
    constructor();
}

/** record error */
/**
 * 记录不存在
 */
declare class RecordNotFoundError extends OpenError {
    constructor();
}
/**
 * 记录相关操作无权限
 */
declare class RecordPermissionDeniedError extends OpenError {
    constructor();
}
declare class SetRecordUnknownError extends OpenError {
    constructor();
}
declare class AddRecordUnknownError extends OpenError {
    constructor();
}
declare class DeleteRecordUnknownError extends OpenError {
    constructor();
}
declare class SingleRecordOperationLimitExceededError extends OpenError {
    constructor();
}

/** view error */
/**
 * 视图不存在
 */
declare class ViewNotFoundError extends OpenError {
    constructor();
}
/**
 * 视图相关操作无权限
 */
declare class ViewPermissionDeniedError extends OpenError {
    constructor();
}
/**
 * 视图名字重复
 */
declare class ViewNameRepeatedError extends OpenError {
    constructor();
}
/**
 * 添加视图未知错误
 */
declare class AddViewUnknownError extends OpenError {
    constructor();
}
/**
 * 设置视图未知错误
 */
declare class SetViewUnknownError extends OpenError {
    constructor();
}
/**
 * 删除视图未知错误
 */
declare class DeleteViewUnknownError extends OpenError {
    constructor();
}
/**
 * 不支持的视图类型
 */
declare class UnSupportedViewTypeError extends OpenError {
    constructor();
}
/**
 * 最后一个视图禁止删除
 */
declare class LastViewDeleteForbiddenError extends OpenError {
    constructor();
}

/**
 * 单元格无相关操作权限
 */
declare class CellPermissionDeniedError extends OpenError {
    constructor();
}
declare class SetCellUnknownError extends OpenError {
    constructor();
}

interface IBridgeModule extends ICommonBridgeModule {
    getPersonalBaseToken: () => Promise<string>;
}
type IBridgeModuleInner = ICommonBridgeModuleInner;
type IBridgeExtra = ICommonBridgeExtra;
type IBridge = IBridgeModule & IBridgeExtra;

type IWidgetBaseModule = ICommonWidgetBaseModule;
type IWidgetBaseModuleInner = ICommonWidgetBaseModuleInner;
type IWidgetBaseExtra = ICommonWidgetBaseExtra;
type IWidgetBase = IWidgetBaseModule & IWidgetBaseExtra;

declare enum HostContainerSize {
    Small = "small",
    Medium = "medium",
    Large = "large"
}
interface IUIModule extends ICommonUIModule {
    /** 关闭当前插件的宿主容器 */
    closeHostContainer(): Promise<boolean>;
    /** 设置当前插件宿主容器大小 **/
    setHostContainerSize(size: HostContainerSize): Promise<boolean>;
}
type IUIModuleInner = ICommonUIModuleInner;
type IUIExtra = ICommonUIExtra;
type IUI = IUIExtra & IUIModule;

interface MessageType {
    info: TypeOpen;
    success: TypeOpen;
    error: TypeOpen;
    warning: TypeOpen;
    loading: TypeOpen;
}
interface BaseFormItemOption {
    label: string;
    [key: string]: unknown;
}
interface BaseFormItem {
    type: string;
    id: string;
    option: BaseFormItemOption;
}
type TableSelectFormItemOption = BaseFormItemOption & Omit<SelectProps, 'mode'>;
interface TableSelectFormItem extends BaseFormItem {
    type: 'table';
    option: TableSelectFormItemOption;
}
interface DependencyTableFormItemOption extends BaseFormItemOption {
    sourceTable: string;
}
interface FieldSelectFormItemFilterOption extends DependencyTableFormItemOption {
    filterByTypes?: any[];
    filter?: (fieldMeta: any) => boolean;
    mode?: 'multiple';
    multiple?: boolean;
}
type FieldSelectFormItemOption = FieldSelectFormItemFilterOption & Omit<SelectProps, 'options'>;
interface FieldSelectFormItem extends BaseFormItem {
    type: 'field';
    option: FieldSelectFormItemOption;
}
interface ViewSelectFormItemFilterOption extends DependencyTableFormItemOption {
    filterByTypes?: any[];
    filter?: (viewMeta: any) => boolean;
    mode?: 'multiple';
    multiple?: boolean;
}
type ViewSelectFormItemOption = ViewSelectFormItemFilterOption & Omit<SelectProps, 'options'>;
interface ViewSelectFormItem extends BaseFormItem {
    type: 'view';
    option: ViewSelectFormItemOption;
}
type InputFormItemOption = BaseFormItemOption & InputProps;
interface InputFormItem extends BaseFormItem {
    type: 'input';
    option: InputFormItemOption;
}
type InputNumberFormItemOption = BaseFormItemOption & InputNumberProps;
interface InputNumberFormItem extends BaseFormItem {
    type: 'inputNumber';
    option: InputNumberFormItemOption;
}
interface TextAreaProps {
    placeholder?: string;
    defaultValue?: string;
    autoSize?: boolean | {
        minRows?: number;
        maxRows?: number;
    };
    allowClear?: boolean | {
        clearIcon?: React.ReactNode;
    };
    maxLength?: number;
}
type TextAreaFormItemOption = BaseFormItemOption & TextAreaProps;
interface TextAreaFormItem extends BaseFormItem {
    type: 'textArea';
    option: TextAreaFormItemOption;
}
type CheckboxGroupFormItemOption = BaseFormItemOption & CheckboxGroupProps;
interface CheckboxGroupFormItem extends BaseFormItem {
    type: 'checkboxGroup';
    option: CheckboxGroupFormItemOption;
}
type SelectFormItemOption = BaseFormItemOption & SelectProps & {
    multiple?: boolean;
    tags?: boolean;
};
interface SelectFormItem extends BaseFormItem {
    type: 'select';
    option: SelectFormItemOption;
}
type FormItem = TableSelectFormItem | FieldSelectFormItem | ViewSelectFormItem | InputFormItem | InputNumberFormItem | TextAreaFormItem | CheckboxGroupFormItem | SelectFormItem;
interface FormInstance {
    tableSelect: (id: string, option: TableSelectFormItemOption) => TableSelectFormItem;
    fieldSelect: (id: string, option: FieldSelectFormItemOption) => FieldSelectFormItem;
    viewSelect: (id: string, option: ViewSelectFormItemOption) => ViewSelectFormItem;
    input: (id: string, option: InputFormItemOption) => InputFormItem;
    inputNumber: (id: string, option: InputNumberFormItemOption) => InputNumberFormItem;
    textArea: (id: string, option: TextAreaFormItemOption) => TextAreaFormItem;
    checkboxGroup: (id: string, option: CheckboxGroupFormItemOption) => CheckboxGroupFormItem;
    select: (id: string, option: SelectFormItemOption) => SelectFormItem;
}

declare class UIBuilder {
    static instance: UIBuilder;
    /**
     * @deprecated \`UIBuilder.getInstance\` will be remove, use \`new UIBuilder\` instead!
     */
    static getInstance(rootSelector: string, options: {
        bitable: any;
        callback: (uiBuilder: UIBuilder) => void;
    }): UIBuilder;
    get message(): MessageType;
    protected loadingRoot?: Root;
    protected rootElement?: Element;
    protected app?: Element;
    protected appElement: Root;
    protected container?: Element;
    private formItemMap;
    private bitable;
    constructor(rootElement: Element, options: {
        bitable: any;
        callback: (uiBuilder: UIBuilder) => void;
    });
    init(runUIBuilder: (uiBuilder: UIBuilder) => void): Promise<void>;
    umount: () => void;
    addComponent(component: ReactElement): void;
    clear: () => void;
    showLoading(message: string): void;
    hideLoading(): void;
    text(source: string): void;
    markdown(source: string): void;
    private clearAfter;
    form(formBuilder: (form: FormInstance) => {
        formItems: FormItem[];
        buttons: (string | {
            key: any;
            label: string;
        })[];
    }, callback: (args: {
        key: string;
        values: {
            [key: string]: unknown;
        };
    }) => void): void;
    buttonsSync(label: string, buttons: (string | {
        key: any;
        label: string;
    })[]): Promise<unknown>;
    buttons(label: string, buttons: (string | {
        key: any;
        label: string;
    })[], callback: (key: any) => void): void;
}

declare class BitableApp {
    /** bitable base */
    readonly base: IBase;
    /** open platform api */
    readonly bridge: IBridge;
    /** ui */
    readonly ui: IUI;
}

declare const bitable: BitableApp;

declare function loadModule(src: string): Promise<any>;

`