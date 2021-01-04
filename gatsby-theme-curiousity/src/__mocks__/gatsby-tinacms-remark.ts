const gatsbyTinaCMSRemark = jest.requireActual("gatsby-tinacms-remark");

export const remarkForm = jest
  .fn()
  .mockImplementation((component) => component);

export const RemarkCreatorPlugin = gatsbyTinaCMSRemark.RemarkCreatorPlugin;

const initialDataInHook = (initialData: any): any => [initialData];

export const useLocalRemarkForm = jest.fn(initialDataInHook);

export const useGlobalRemarkForm = jest.fn(initialDataInHook);
