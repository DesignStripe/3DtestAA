Antialias Investigation
=======================

Made the following render changes:

1) Changed all relevant textures to sRGB - this converts the texture from sRGB colour space to linear in the shaders.  All colour operations should be done in linear colour space for correct colour interpolation.
2) Changed renderer to sRGB output.  This converts the internal linear colour space to sRGB output.
3) Separate ThreePostprocess EffectComposer using three.js directly with gamma correction pass.
4) Fixed z-fighting issue.
5) Fixed screen luminance issue.
6) MSAA working with Three EffectComposer.
7) It is possible to turn on both SMAA and MSAA for a slightly improved AA result (at a significant cost).

References
----------

1) MSAA does not work well in postprocessing 
    * https://github.com/pmndrs/postprocessing/wiki/Antialiasing
    * https://github.com/pmndrs/postprocessing/issues/218
2) Colour Space usage:
    * https://www.donmccurdy.com/2020/06/17/color-management-in-threejs

The edge of the screen zoomed in to demonstrate broken MS renderbuffer resolving (react-postprocessing).

![](./Screenshot from 2023-01-23 09-58-49.png)


