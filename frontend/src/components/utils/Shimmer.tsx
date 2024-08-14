import React from "react";
import ContentLoader, { IContentLoaderProps } from 'react-content-loader'




const Shimmer = (props: IContentLoaderProps) => (
    <ContentLoader
        speed={2}
        width="100%"
        height={20}  
        viewBox="0 0 0 48"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
    >
        <rect x="0" y="0" rx="5" ry="5" width="100%" height="20" />
    </ContentLoader>
);

export default Shimmer

export const Shimmer2 = (props: IContentLoaderProps) => (
    <ContentLoader
        speed={2}
        width={400}
        height={160}  
        viewBox="0 0 400 160"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
    >
        <rect x="0" y="0" rx="5" ry="5" width="400" height="160" />
    </ContentLoader>
);

