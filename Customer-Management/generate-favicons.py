"""Generate SIDEBOARD favicon PNGs and ICO from the logo concept.

Single violet hue (#7c3aed) with white hub on a rounded square plate.
Scales down cleanly: at 16px the inner detail merges into a recognizable mark.
"""
from PIL import Image, ImageDraw
import os

OUT = r"D:\Project_Angular\Collaborative-Model\Customer-Management\src\assets"
os.makedirs(OUT, exist_ok=True)

VIOLET = (124, 58, 237)        # #7c3aed — primary
VIOLET_SOFT = (196, 181, 253)  # #c4b5fd — outer nodes
WHITE = (255, 255, 255)
TRANSPARENT = (0, 0, 0, 0)


def render(size: int) -> Image.Image:
    """Render logo at given size onto an RGBA image with transparent background."""
    img = Image.new("RGBA", (size, size), TRANSPARENT)
    draw = ImageDraw.Draw(img)
    s = size / 48.0  # scale factor (master canvas is 48x48)

    # Rounded square plate
    plate_radius = int(12 * s)
    draw.rounded_rectangle(
        [(2 * s, 2 * s), (46 * s, 46 * s)],
        radius=plate_radius,
        fill=VIOLET,
    )

    # Connection lines
    line_w = max(1, int(1.6 * s))
    lines = [
        ((19 * s, 14 * s), (13 * s, 31 * s)),
        ((29 * s, 14 * s), (35 * s, 31 * s)),
        ((19 * s, 14 * s), (29 * s, 14 * s)),
    ]
    for a, b in lines:
        draw.line([a, b], fill=VIOLET_SOFT, width=line_w)

    # Outer nodes
    outer_nodes = [(19 * s, 14 * s), (29 * s, 14 * s)]
    for cx, cy in outer_nodes:
        r = 3.2 * s
        draw.ellipse([(cx - r, cy - r), (cx + r, cy + r)], fill=VIOLET_SOFT)

    # Lower outer nodes (slightly smaller)
    lower_nodes = [(13 * s, 31 * s), (35 * s, 31 * s)]
    for cx, cy in lower_nodes:
        r = 3.0 * s
        draw.ellipse([(cx - r, cy - r), (cx + r, cy + r)], fill=VIOLET_SOFT)

    # Central hub — white with violet dot
    hub_r = 5.2 * s
    hub_cx, hub_cy = 24 * s, 24 * s
    draw.ellipse(
        [(hub_cx - hub_r, hub_cy - hub_r), (hub_cx + hub_r, hub_cy + hub_r)],
        fill=WHITE,
    )
    inner_r = 2.0 * s
    draw.ellipse(
        [(hub_cx - inner_r, hub_cy - inner_r), (hub_cx + inner_r, hub_cy + inner_r)],
        fill=VIOLET,
    )

    return img


# Generate sizes used in index.html
sizes = {
    "favicon-16x16.png": 16,
    "favicon-32x32.png": 32,
    "favicon-48x48.png": 48,
    "apple-touch-icon.png": 180,
    "android-chrome-192x192.png": 192,
    "android-chrome-512x512.png": 512,
}
for name, sz in sizes.items():
    img = render(sz)
    img.save(os.path.join(OUT, name), "PNG")
    print(f"wrote {name} ({sz}x{sz})")

# Multi-resolution ICO
ico_sizes = [16, 32, 48]
ico_imgs = [render(s) for s in ico_sizes]
ico_imgs[0].save(
    os.path.join(OUT, "favicon.ico"),
    format="ICO",
    sizes=[(s, s) for s in ico_sizes],
    append_images=ico_imgs[1:],
)
print("wrote favicon.ico")

# SVG favicon (separate, hand-tuned for crispness)
svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect x="2" y="2" width="44" height="44" rx="12" fill="#7c3aed"/>
  <g stroke="#c4b5fd" stroke-width="1.6" stroke-linecap="round" fill="none" opacity="0.55">
    <path d="M19 14 L13 31"/>
    <path d="M29 14 L35 31"/>
    <path d="M19 14 L29 14"/>
  </g>
  <circle cx="19" cy="14" r="3.2" fill="#c4b5fd"/>
  <circle cx="29" cy="14" r="3.2" fill="#c4b5fd"/>
  <circle cx="13" cy="31" r="3"   fill="#c4b5fd"/>
  <circle cx="35" cy="31" r="3"   fill="#c4b5fd"/>
  <circle cx="24" cy="24" r="5.2" fill="#ffffff"/>
  <circle cx="24" cy="24" r="2"   fill="#7c3aed"/>
</svg>
'''
with open(os.path.join(OUT, "favicon.svg"), "w") as f:
    f.write(svg)
print("wrote favicon.svg")
