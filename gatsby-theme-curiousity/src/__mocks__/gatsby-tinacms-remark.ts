const gatsbyTinaCMSRemark = require.requireActual("gatsby-tinacms-remark");

export const remarkForm = jest
  .fn()
  .mockImplementation((component, options) => component);

export const RemarkCreatorPlugin = gatsbyTinaCMSRemark.RemarkCreatorPlugin;

const initialDataInHook = (initialData, options) => [initialData];

export const useLocalRemarkForm = jest.fn(initialDataInHook);

export const useGlobalRemarkForm = jest.fn(initialDataInHook);
