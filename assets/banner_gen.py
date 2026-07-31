from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math, random

W, H = 1280, 640
img = Image.new("RGB", (W, H), "#0B0B10")
draw = ImageDraw.Draw(img)

# Diagonal gradient background (dark charcoal -> deep pink glow)
top = (13, 13, 18)
bottom = (35, 8, 22)
for y in range(H):
    t = y / H
    r = int(top[0] + (bottom[0] - top[0]) * t)
    g = int(top[1] + (bottom[1] - top[1]) * t)
    b = int(top[2] + (bottom[2] - top[2]) * t)
    draw.line([(0, y), (W, y)], fill=(r, g, b))

# Soft pink radial glow (top-left) and secondary glow (bottom-right)
glow = Image.new("RGB", (W, H), (0, 0, 0))
glow_draw = ImageDraw.Draw(glow)
glow_draw.ellipse([-260, -260, 620, 560], fill=(245, 5, 117))
glow_draw.ellipse([820, 300, 1500, 900], fill=(45, 45, 45))
glow = glow.filter(ImageFilter.GaussianBlur(160))
img = Image.blend(img, glow, 0.55)
draw = ImageDraw.Draw(img)

# Subtle grid dots pattern
random.seed(7)
dot_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
dot_draw = ImageDraw.Draw(dot_layer)
for x in range(0, W, 34):
    for y in range(0, H, 34):
        if random.random() < 0.5:
            dot_draw.ellipse([x, y, x + 2, y + 2], fill=(255, 255, 255, 18))
img = Image.alpha_composite(img.convert("RGBA"), dot_layer).convert("RGB")
draw = ImageDraw.Draw(img)

def try_fonts(paths_sizes):
    for path, size in paths_sizes:
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            continue
    return ImageFont.load_default()

font_paths = [
    "C:/Windows/Fonts/arialbd.ttf",
    "C:/Windows/Fonts/segoeuib.ttf",
    "arialbd.ttf",
]

title_font = try_fonts([(p, 148) for p in font_paths])
sub_font = try_fonts([(p, 34) for p in font_paths])
tag_font = try_fonts([(p, 26) for p in font_paths])

# Phone mockup on the right side showing a vertical feed silhouette
phone_x, phone_y, phone_w, phone_h = 940, 90, 230, 460
draw.rounded_rectangle(
    [phone_x, phone_y, phone_x + phone_w, phone_y + phone_h],
    radius=34, fill=(20, 20, 26), outline=(70, 70, 80), width=4
)
screen_pad = 12
sx0, sy0 = phone_x + screen_pad, phone_y + screen_pad
sx1, sy1 = phone_x + phone_w - screen_pad, phone_y + phone_h - screen_pad
draw.rounded_rectangle([sx0, sy0, sx1, sy1], radius=24, fill=(10, 10, 14))

# Fake vertical feed card gradient (pink -> purple)
card_pad = 6
cx0, cy0 = sx0 + card_pad, sy0 + card_pad
cx1, cy1 = sx1 - card_pad, sy1 - card_pad
card_h = cy1 - cy0
for i in range(card_h):
    t = i / card_h
    r = int(245 * (1 - t) + 60 * t)
    g = int(5 * (1 - t) + 10 * t)
    b = int(117 * (1 - t) + 120 * t)
    draw.line([(cx0, cy0 + i), (cx1, cy0 + i)], fill=(r, g, b))

# Fake HUD pill + heart/comment icons on the mock phone
draw.rounded_rectangle([cx0 + 14, cy0 + 18, cx0 + 110, cy0 + 46], radius=14, fill=(0, 0, 0))
draw.text((cx0 + 22, cy0 + 23), "SCORE 240", font=tag_font.font_variant(size=16), fill=(255, 255, 255))

icon_x = cx1 - 34
for i, label in enumerate(["❤", "💬", "↗"]):
    icon_y = cy1 - 170 + i * 58
    draw.ellipse([icon_x - 20, icon_y - 20, icon_x + 20, icon_y + 20], fill=(0, 0, 0, 140))
    draw.text((icon_x - 10, icon_y - 13), label, font=tag_font, fill=(255, 255, 255))

# Notch
draw.rounded_rectangle([phone_x + phone_w / 2 - 30, phone_y + 4, phone_x + phone_w / 2 + 30, phone_y + 16], radius=8, fill=(20,20,26))

# Title text "ZEEL"
title_x, title_y = 76, 180
draw.text((title_x, title_y), "ZEEL", font=title_font, fill=(255, 255, 255))
# Pink accent underline slice through letter shapes
draw.text((title_x + 2, title_y + 2), "ZEEL", font=title_font, fill=(245, 5, 117))
draw.text((title_x, title_y), "ZEEL", font=title_font, fill=(255, 255, 255))

# Subtitle
draw.text((title_x + 6, title_y + 170), "Swipe. Play. Repeat.", font=sub_font, fill=(230, 230, 235))
draw.text((title_x + 6, title_y + 215), "A TikTok-style vertical feed of instantly playable mini-games", font=ImageFont.truetype(font_paths[0], 24) if True else sub_font, fill=(180, 180, 190))

# Small tag chips
chip_labels = ["React + Vite", "Node + Prisma", "Playwright", "Mobile-first"]
chip_x = title_x + 6
chip_y = title_y + 270
for label in chip_labels:
    w = draw.textlength(label, font=tag_font) + 28
    draw.rounded_rectangle([chip_x, chip_y, chip_x + w, chip_y + 40], radius=20, outline=(245, 5, 117), width=2)
    draw.text((chip_x + 14, chip_y + 7), label, font=tag_font, fill=(255, 255, 255))
    chip_x += w + 14

img.save("e:/Gamzy Mine Project/TikTok Like App/assets/banner.png")
print("saved")
