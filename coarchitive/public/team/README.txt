Team portraits.

  aneesha-jayaram.jpg
  shreedha-lanjewar.jpg
  nakka-sunny.jpg
  raksha-mundhada.jpg
  ajay-sarath.jpg

All five are normalised to the SAME framing so the grid reads evenly:

  900 x 1200 (3:4 portrait), JPEG q88 progressive
  face height  = 36% of the image height
  face centre  = 50% across, 38% down

That normalisation matters more than the pixel size. The source photos ranged
from a wide environmental shot (face 16% of frame) to tight passport crops
(face 43%), which looked badly mismatched side by side even though every tile
is the same size on screen.

Replacing one
-------------
Dropping a new file here works, but crop it to the numbers above or it will
look out of step with the rest. The repeatable way is to re-run the crop:
detect the face, scale so its height is 36% of the output, place its centre at
(50%, 38%), pad by edge-replication only where the source runs out. Ask and the
script can be restored to the repo.

Known limitation: raksha-mundhada.jpg comes from a 350x370 original, so it is
upscaled ~2.8x and is visibly softer than the others. A larger original would
fix it.

Adding a person
---------------
Add them to DIRECTORS or TEAM in src/data.js with the portrait() helper, then
drop the matching file here. A missing file falls back to the stock placeholder
stacked underneath, so the tile never renders empty.
