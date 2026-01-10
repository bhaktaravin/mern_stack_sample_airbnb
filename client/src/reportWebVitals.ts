import { ReportHandler } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    Promise.all([
      import('web-vitals').then(mod => ({ getCLS: mod.getCLS })),
      import('web-vitals').then(mod => ({ getFID: mod.getFID })),
      import('web-vitals').then(mod => ({ getFCP: mod.getFCP })),
      import('web-vitals').then(mod => ({ getLCP: mod.getLCP })),
      import('web-vitals').then(mod => ({ getTTFB: mod.getTTFB })),
    ]).then(([{ getCLS }, { getFID }, { getFCP }, { getLCP }, { getTTFB }]) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
