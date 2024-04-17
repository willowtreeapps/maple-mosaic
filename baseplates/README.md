# Baseplates

This is a script that generates lego mosaic instructions for each baseplate, given an image. The image must have width and height both multiples of 8. The image should be pre-processed to have colors exclusively limited to available lego brick colors, as defined in `../colors.yml`.

## Installation

It's recommended to use [pyenv](https://github.com/pyenv/pyenv) to use the Python version specified in `.python_version` and use a virtual environment to install the dependencies.

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
deactivate
```

## Usage

Run the script with the path to the image as an argument. The script will generate a set of instructions for each baseplate, in the form of an image file. The instruction images will be saved in the `outputs` folder, which will be created if needed.

```bash
source venv/bin/activate
python baseplates.py <image_path>
deactivate
```
