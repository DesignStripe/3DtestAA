Rock Scene
==========

Opted for Physically-based Rendering example here.  Using GLTF-transform for mesh & texture compression.  Physically-
based lighting & rendering.


Issues:
-------

1) The GLB is huge and the default tools had problems with processing the 8192x8192 textures.

Steps to process:

1) Extract all assets from GLB to GLTF bin + texture image files
2) Resize texture files from 8192^2 to 4096^2 (imagemagick convert)
3) Keep file as glb ultra quality (not really usable like this)
4) Reprocess file to textures to 4096^2 + uastc texture compression - keep as high quality 
5) Reprocess glb file to textures of 2048^2 + uastc texture compression - keep as medium quality (tablets)

(see /public/scene2/gltf/process.sh)

Encountered this error trying to load KTX2 textures in GLB:

https://discourse.threejs.org/t/three-gltfloader-couldnt-load-texture/29788

To Resolve bug in R3F:

1) Export glb textures to have dims of 1 x 1.
2) Load GLB as per normal
3) Load KTX2 textures individually using useKTX2 (drei)

This is before compression and optimisation:

<pre> TEXTURES
 ────────────────────────────────────────────
<font color="#5E5C64">┌───┬────────────────────────┬─────────────────────────┬──────────────────────────┬───────────┬────────────┬─────────────┬────────────┬───────────┬───────────┐</font>
<font color="#5E5C64">│</font><font color="#C01C28"> # </font><font color="#5E5C64">│</font><font color="#C01C28"> name                   </font><font color="#5E5C64">│</font><font color="#C01C28"> uri                     </font><font color="#5E5C64">│</font><font color="#C01C28"> slots                    </font><font color="#5E5C64">│</font><font color="#C01C28"> instances </font><font color="#5E5C64">│</font><font color="#C01C28"> mimeType   </font><font color="#5E5C64">│</font><font color="#C01C28"> compression </font><font color="#5E5C64">│</font><font color="#C01C28"> resolution </font><font color="#5E5C64">│</font><font color="#C01C28"> size      </font><font color="#5E5C64">│</font><font color="#C01C28"> gpuSize¹  </font><font color="#5E5C64">│</font>
<font color="#5E5C64">├───┼────────────────────────┼─────────────────────────┼──────────────────────────┼───────────┼────────────┼─────────────┼────────────┼───────────┼───────────┤</font>
<font color="#5E5C64">│</font> 0 <font color="#5E5C64">│</font> wjssaf3_8K_Normal_LOD0 <font color="#5E5C64">│</font> normal_1.jpg            <font color="#5E5C64">│</font> normalTexture            <font color="#5E5C64">│</font> 1         <font color="#5E5C64">│</font> image/jpeg <font color="#5E5C64">│</font>             <font color="#5E5C64">│</font> 8192x8192  <font color="#5E5C64">│</font> 113.98 MB <font color="#5E5C64">│</font> 357.91 MB <font color="#5E5C64">│</font>
<font color="#5E5C64">├───┼────────────────────────┼─────────────────────────┼──────────────────────────┼───────────┼────────────┼─────────────┼────────────┼───────────┼───────────┤</font>
<font color="#5E5C64">│</font> 1 <font color="#5E5C64">│</font> wjssaf3_8K_Albedo      <font color="#5E5C64">│</font> baseColor_1.jpg         <font color="#5E5C64">│</font> baseColorTexture         <font color="#5E5C64">│</font> 1         <font color="#5E5C64">│</font> image/jpeg <font color="#5E5C64">│</font>             <font color="#5E5C64">│</font> 8192x8192  <font color="#5E5C64">│</font> 59.85 MB  <font color="#5E5C64">│</font> 357.91 MB <font color="#5E5C64">│</font>
<font color="#5E5C64">├───┼────────────────────────┼─────────────────────────┼──────────────────────────┼───────────┼────────────┼─────────────┼────────────┼───────────┼───────────┤</font>
<font color="#5E5C64">│</font> 2 <font color="#5E5C64">│</font> wjssaf3_8K_Roughness   <font color="#5E5C64">│</font> metallicRoughness_1.png <font color="#5E5C64">│</font> metallicRoughnessTexture <font color="#5E5C64">│</font> 1         <font color="#5E5C64">│</font> image/png  <font color="#5E5C64">│</font>             <font color="#5E5C64">│</font> 8192x8192  <font color="#5E5C64">│</font> 56.02 MB  <font color="#5E5C64">│</font> 357.91 MB <font color="#5E5C64">│</font>
<font color="#5E5C64">└───┴────────────────────────┴─────────────────────────┴──────────────────────────┴───────────┴────────────┴─────────────┴────────────┴───────────┴───────────┘</font>

¹ gpuSize estimates minimum GPU memory allocation. Older devices may require
  additional memory for GPU compression formats.
</pre>

This is after compression:

<pre>TEXTURES
 ────────────────────────────────────────────
<font color="#5E5C64">┌───┬────────────────────────┬─────┬──────────────────────────┬───────────┬────────────┬─────────────┬────────────┬─────────┬──────────┐</font>
<font color="#5E5C64">│</font><font color="#C01C28"> # </font><font color="#5E5C64">│</font><font color="#C01C28"> name                   </font><font color="#5E5C64">│</font><font color="#C01C28"> uri </font><font color="#5E5C64">│</font><font color="#C01C28"> slots                    </font><font color="#5E5C64">│</font><font color="#C01C28"> instances </font><font color="#5E5C64">│</font><font color="#C01C28"> mimeType   </font><font color="#5E5C64">│</font><font color="#C01C28"> compression </font><font color="#5E5C64">│</font><font color="#C01C28"> resolution </font><font color="#5E5C64">│</font><font color="#C01C28"> size    </font><font color="#5E5C64">│</font><font color="#C01C28"> gpuSize¹ </font><font color="#5E5C64">│</font>
<font color="#5E5C64">├───┼────────────────────────┼─────┼──────────────────────────┼───────────┼────────────┼─────────────┼────────────┼─────────┼──────────┤</font>
<font color="#5E5C64">│</font> 0 <font color="#5E5C64">│</font> wjssaf3_8K_Normal_LOD0 <font color="#5E5C64">│</font>     <font color="#5E5C64">│</font> normalTexture            <font color="#5E5C64">│</font> 1         <font color="#5E5C64">│</font> image/ktx2 <font color="#5E5C64">│</font> UASTC       <font color="#5E5C64">│</font> 2048x2048  <font color="#5E5C64">│</font> 4.97 MB <font color="#5E5C64">│</font> 5.59 MB  <font color="#5E5C64">│</font>
<font color="#5E5C64">├───┼────────────────────────┼─────┼──────────────────────────┼───────────┼────────────┼─────────────┼────────────┼─────────┼──────────┤</font>
<font color="#5E5C64">│</font> 1 <font color="#5E5C64">│</font> wjssaf3_8K_Albedo      <font color="#5E5C64">│</font>     <font color="#5E5C64">│</font> baseColorTexture         <font color="#5E5C64">│</font> 1         <font color="#5E5C64">│</font> image/ktx2 <font color="#5E5C64">│</font> UASTC       <font color="#5E5C64">│</font> 2048x2048  <font color="#5E5C64">│</font> 4.17 MB <font color="#5E5C64">│</font> 5.59 MB  <font color="#5E5C64">│</font>
<font color="#5E5C64">├───┼────────────────────────┼─────┼──────────────────────────┼───────────┼────────────┼─────────────┼────────────┼─────────┼──────────┤</font>
<font color="#5E5C64">│</font> 2 <font color="#5E5C64">│</font> wjssaf3_8K_Roughness   <font color="#5E5C64">│</font>     <font color="#5E5C64">│</font> metallicRoughnessTexture <font color="#5E5C64">│</font> 1         <font color="#5E5C64">│</font> image/ktx2 <font color="#5E5C64">│</font> UASTC       <font color="#5E5C64">│</font> 2048x2048  <font color="#5E5C64">│</font> 3.05 MB <font color="#5E5C64">│</font> 5.59 MB  <font color="#5E5C64">│</font>
<font color="#5E5C64">└───┴────────────────────────┴─────┴──────────────────────────┴───────────┴────────────┴─────────────┴────────────┴─────────┴──────────┘</font>

¹ gpuSize estimates minimum GPU memory allocation. Older devices may require
  additional memory for GPU compression formats.
</pre>

References:

https://github.com/donmccurdy/glTF-Transform/issues/344
