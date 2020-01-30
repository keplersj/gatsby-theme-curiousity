const gatsbyTinaCMSRemark = require.requireActual("gatsby-tinacms-remark");

export const remarkForm = jest.fn().mockImplementation(component => component);

export const RemarkCreatorPlugin = gatsbyTinaCMSRemark.RemarkCreatorPlugin;

const initialDataInHook = <T>(initialData: T): [T] => [initialData];

export const useLocalRemarkForm = jest.fn(initialDataInHook);

export const useGlobalRemarkForm = jest.fn(initialDataInHook);
