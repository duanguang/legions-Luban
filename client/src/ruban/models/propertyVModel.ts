
import {JsonProperty,MapperEntity} from 'json-mapper-object';
class PropertyVModel{

    @JsonProperty('iAntdProps.name')
    name = ''

    @JsonProperty('iAntdProps.groupId')
    groupId = null
    @JsonProperty('iAntdProps.span')
    containerSpan = null;

    @JsonProperty('visibleProperty')
    visibleProperty = false;

    @JsonProperty('isRequired')
    isRequired = false;

    @JsonProperty('inputType')
    inputType = 'text';

    @JsonProperty('maxLength')
    maxLength = '';

    /* @JsonProperty('selectOptionsValue')
    selectOptionsValue = void 0; */
    @JsonProperty('placeholderProperty')
    placeholderProperty = void 0;

    @JsonProperty('selectModelProperty')
    selectModelProperty = 'single';

    get subGroup() {
        return this.groupId&&this.groupId.toString()
    }
}
export class PropertyInputVModel extends PropertyVModel{
    @JsonProperty('iFormInput.label')
    labelName = ''

    @JsonProperty('iFormInput.labelCol.span')
    labelSpan = ''

    @JsonProperty('iFormInput.wrapperCol.span')
    elementSpan = ''

    @JsonProperty('iFormInput.type')
    inputType = ''

    @JsonProperty('iFormInput.maxLength')
    maxLength = ''

    @JsonProperty('iFormInput.disabled')
    isDisabled = false;
}

export class PropertySelectVModel extends PropertyVModel{
    @JsonProperty('iFormWithSelect.label')
    labelName = ''

    @JsonProperty('iFormWithSelect.labelCol.span')
    labelSpan = ''

    @JsonProperty('iFormWithSelect.wrapperCol.span')
    elementSpan = ''

    @JsonProperty('iFormWithSelect.disabled')
    isDisabled = false;

    @JsonProperty('selectModelProperty')
    selectModelProperty = 'single';

    @JsonProperty('selectOptions')
    selectOptions = void 0;
}

export class PropertyRangePickerVModel extends PropertyVModel{
    @JsonProperty('iFormRangePicker.label')
    labelName = ''

    @JsonProperty('iFormRangePicker.labelCol.span')
    labelSpan = ''

    @JsonProperty('iFormRangePicker.wrapperCol.span')
    elementSpan = ''

    @JsonProperty('iFormRangePicker.disabled')
    isDisabled = false;

    @JsonProperty('format')
    format = 'YYYY-MM-DD HH:mm:ss'
    
    @JsonProperty('showTime')
    showTime = false

    @JsonProperty('disabledDate')
    disabledDate = ''
}
export class PropertyDatePickerVModel extends PropertyVModel{
    @JsonProperty('iFormDatePicker.label')
    labelName = ''

    @JsonProperty('iFormDatePicker.labelCol.span')
    labelSpan = ''

    @JsonProperty('iFormDatePicker.wrapperCol.span')
    elementSpan = ''

    @JsonProperty('iFormDatePicker.disabled')
    isDisabled = false;

    @JsonProperty('format')
    format = 'YYYY-MM-DD HH:mm:ss'
    
    @JsonProperty('showTime')
    showTime = false

    @JsonProperty('disabledDate')
    disabledDate = ''
}
export class PropertyRadioButtonVModel extends PropertyVModel{
    @JsonProperty('iFormWithRadioButton.label')
    labelName = ''

    @JsonProperty('iFormWithRadioButton.labelCol.span')
    labelSpan = ''

    @JsonProperty('iFormWithRadioButton.wrapperCol.span')
    elementSpan = ''

    @JsonProperty('iFormWithRadioButton.disabled')
    isDisabled = false
}

export class PropertyUploadVModel extends PropertyVModel{
    @JsonProperty('iFormWithUpload.label')
    labelName = ''

    @JsonProperty('iFormWithUpload.labelCol.span')
    labelSpan = ''

    @JsonProperty('iFormWithUpload.wrapperCol.span')
    elementSpan = ''

    @JsonProperty('iFormWithUpload.disabled')
    isDisabled = false;

    @JsonProperty('uploadDataTransform')
    uploadDataTransform = '';

    @JsonProperty('uploadParams')
    uploadParams = '';

    @JsonProperty('uploadshowFileListGroup')
    uploadshowFileListGroup = '';

    @JsonProperty('uploadmaxFileCount')
    uploadmaxFileCount = '';

    @JsonProperty('uploadShowFileList')
    uploadShowFileList = false;

    @JsonProperty('uploadMultiple')
    uploadMultiple = false;

    @JsonProperty('uploadIsDragger')
    uploadIsDragger = false;

    @JsonProperty('uploadaccept')
    uploadacceptList = [];

    get uploadaccept() {
        return [...this.uploadacceptList]
    }
}

export class PropertySwitchVModel extends PropertyVModel{
    @JsonProperty('iFormWithSwitch.label')
    labelName = ''

    @JsonProperty('iFormWithSwitch.labelCol.span')
    labelSpan = ''

    @JsonProperty('iFormWithSwitch.wrapperCol.span')
    elementSpan = ''

    @JsonProperty('iFormWithSwitch.disabled')
    isDisabled = false;
}

