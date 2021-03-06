import { ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElPagination, ElPopover, ElTable, ElTableColumn } from 'element-plus';

export default (app) => {
  app.use(ElButton);
  app.use(ElTable);
  app.use(ElTableColumn);
  app.use(ElPagination);
  app.use(ElInput);
  app.use(ElPopover);
  app.use(ElDialog);
  app.use(ElForm);
  app.use(ElFormItem);
};
