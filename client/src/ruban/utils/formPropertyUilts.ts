import get from 'lodash/get';
import set from 'lodash/set';
import has from 'lodash/has';
import {
  IPropertyData,
  ICompoentData,
  ComponentType,
} from '../stores/projectFormProperty';

import { FORM_PROPERTY_AST } from '../constants/consts';
import {
  createGroup,
  createIAntdProps,
  createLayout,
  createRuleProperty,
  createIFormPropsProperty,
  createSelectProperties,
  createInputProperties,
  createUploadProperties,
  createDateProperties,
  createRadioProperties,
} from 'legions-utils-ast/transform.antd.design';

const create = (type: ComponentType, value: IPropertyData['propertyValue']) => {
  let model = { componentType: type };
  const COMMONPROPERTY = ['onChange', 'onFocus', 'onBlur'];
  FORM_PROPERTY_AST[type] &&
    [...FORM_PROPERTY_AST[type], ...COMMONPROPERTY].map(items => {
      const itemValue = value.find(item => item.key === items);
      model[items] = get(itemValue, 'value', void 0);
    });
  return model;
};
export const FormPropertyAstUtils = {
  createRuleProperty,
  createLayout,
  createIAntdProps,
  createGroup,
  create,
  createIFormPropsProperty,
  createSelectProperties,
  createInputProperties,
  createUploadProperties,
  createDateProperties,
  createRadioProperties,
};
