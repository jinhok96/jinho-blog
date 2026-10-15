#include <lcms2.h>
int main(){
 cmsCIExyY wp={0.3127,0.3290,1.0};
 cmsCIExyYTRIPLE pr={{0.680,0.320,1.0},{0.265,0.690,1.0},{0.150,0.060,1.0}};
 double params[5]={2.4,1.0/1.055,0.055/1.055,1.0/12.92,0.04045};
 cmsToneCurve* c=cmsBuildParametricToneCurve(NULL,4,params);
 cmsToneCurve* t[3]={c,c,c};
 cmsHPROFILE h=cmsCreateRGBProfile(&wp,&pr,t);
 cmsMLU* d=cmsMLUalloc(NULL,1); cmsMLUsetASCII(d,"en","US","Display P3 (ToolProof test)");
 cmsWriteTag(h,cmsSigProfileDescriptionTag,d);
 cmsSaveProfileToFile(h,"/tmp/heic/DisplayP3.icc"); return 0;}
