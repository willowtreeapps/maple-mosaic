import sys
import os
import yaml
from PIL import Image, ImageFont, ImageDraw

PLATE_SIZE = 8
PIXELS_PER_STUD = 80
PIXELS_PER_GAP = 8
OUTPUT_FOLDER = "outputs"

symbol_font = ImageFont.truetype("Helvetica.ttc", 24)
plate_name_font = ImageFont.truetype("Helvetica.ttc", 72)
(left, top, right, bottom) = plate_name_font.getbbox("A1")
text_height = bottom - top

def verify_dimensions(image):
    width, height = image.size
    if width % PLATE_SIZE != 0 or height % PLATE_SIZE != 0:
        print(f"Image dimensions must be multiples of {PLATE_SIZE}")
        sys.exit(1)

def crop_plate(image, x, y) -> Image:
    left = x * PLATE_SIZE
    top = y * PLATE_SIZE
    right = left + PLATE_SIZE
    bottom = top + PLATE_SIZE

    plate = image.crop((left, top, right, bottom))
    return plate

def create_plate_image(image, x, y, plate_name, color_symbols) -> Image:
    width = PLATE_SIZE * (PIXELS_PER_STUD + PIXELS_PER_GAP) + PIXELS_PER_GAP
    height = PLATE_SIZE * (PIXELS_PER_STUD + PIXELS_PER_GAP) + PIXELS_PER_GAP * 2 + text_height 
    black = (0, 0, 0, 255)
    white = (255, 255, 255, 255)

    plate_image = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(plate_image)

    draw.text(
        xy=(PIXELS_PER_GAP, height - PIXELS_PER_GAP),
        text=plate_name,
        fill=black,
        font=plate_name_font,
        anchor="lb",
    )

    plate = crop_plate(image, x, y)
    for x_pixel in range(0, PLATE_SIZE):
        for y_pixel in range(0, PLATE_SIZE):
            color = plate.getpixel((x_pixel, y_pixel))
            color_intensity = (color[0] + color[1] + color[2]) / 3
            rectangle_x = x_pixel * (PIXELS_PER_STUD + PIXELS_PER_GAP) + PIXELS_PER_GAP
            rectangle_y = y_pixel * (PIXELS_PER_STUD + PIXELS_PER_GAP) + PIXELS_PER_GAP
            outline_color = black
            draw.rectangle(
                xy=[(rectangle_x, rectangle_y), (rectangle_x + PIXELS_PER_STUD - 1, rectangle_y + PIXELS_PER_STUD - 1)],
                fill=color,
                outline=outline_color,
                width=2,
            )
            try:
                symbol = color_symbols[(color[0], color[1], color[2])]
                symbol_color = white if color_intensity < 128 else black
                draw.text(
                    xy=(rectangle_x + PIXELS_PER_STUD / 2, rectangle_y + PIXELS_PER_STUD / 2),
                    text=symbol,
                    fill=symbol_color,
                    font=symbol_font,
                    anchor="mm",
                )
            except KeyError:
                print(f"Symbol not found for color: {color}")

    return plate_image

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python baseplates.py <path_to_image_file>")
        sys.exit(1)

    file = sys.argv[1]
    if not os.path.exists(OUTPUT_FOLDER):
        os.makedirs(OUTPUT_FOLDER)

    colors_path = os.path.join(os.path.dirname(__file__), "..", "colors.yml")
    with open(os.path.normpath(colors_path), "r") as colors_file:
        try:
            colors = yaml.safe_load(colors_file)
        except yaml.YAMLError as exc:
            print(f"Error loading ../colors.yml: {exc}")
            sys.exit(1)

    color_symbols = {(color[":red"], color[":green"], color[":blue"]): color[":symbol"] for color in colors}

    try:
        with Image.open(file) as image:
            if image.mode != "RGB":
                image = image.convert("RGB")

            verify_dimensions(image)

            for x in range(0, int(image.width / PLATE_SIZE)):
                for y in range(0, int(image.height / PLATE_SIZE)):
                    row = y + 1
                    column = chr(x + ord("A"))
                    plate_name = f"{column}{row}"

                    plate_image = create_plate_image(image, x, y, plate_name, color_symbols)
                    plate_image.save(f"{OUTPUT_FOLDER}/{plate_name}.png")
    except OSError:
        pass
