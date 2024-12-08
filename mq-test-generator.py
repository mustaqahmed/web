#!/usr/bin/python3
# Generator for mq-test.html

from string import Template

#======= Media query features =======
#Source: http://dev.w3.org/csswg/mediaqueries-4
class MQFeature:
    def __init__(self, feature_name, feature_values, feature_prefix = None):
        self.name = feature_name
        self.values = feature_values
        self.prefix = feature_prefix

mq_features = [
    MQFeature("width", ["200px", "400px", "800px", "1000px", "1200px", "1600px"], "min"),
    MQFeature("height", ["200px", "400px", "800px", "1000px", "1200px", "1600px"], "min"),
    MQFeature("aspect-ratio", ["1/2", "9/16", "3/4", "1/1", "4/3", "16/9", "2/1"], "min"),
    MQFeature("orientation", ["portrait", "landscape"]),


    MQFeature("resolution", ["1dppx", "1.25dppx", "1.5dppx", "2dppx", "3dppx", "100dpi", "200dpi", "400dpi", "800dpi"], "min"),
    MQFeature("scan", ["interlace", "progressive"]),
    MQFeature("grid", []),
    MQFeature("update-frequency", ["none", "slow", "normal"]),
    MQFeature("overflow-block", ["none", "scroll", "optional-paged", "paged"]),
    MQFeature("overflow-inline", ["none", "scroll"]),

    MQFeature("color", ["1", "2", "4", "8", "16", "32"], "min"),
    MQFeature("color-index", ["1", "2", "4", "8"], "min"),
    MQFeature("monochrome", ["1", "2", "4", "8"], "min"),
    MQFeature("inverted-colors", ["none", "inverted"]),

    MQFeature("pointer", ["none", "coarse", "fine"]),
    MQFeature("hover", ["none", "hover"]),
    MQFeature("any-pointer", ["none", "coarse", "fine"]),
    MQFeature("any-hover", ["none", "on-demand", "hover"]),

    MQFeature("light-level", ["dim", "normal", "washed"]),

    MQFeature("scripting", ["none", "initial-only", "enabled"]),
]

#======= Templates =======

html_template="""\
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="description" content="Media query tester, generated using mq-test-generator.py">
  <title>Media query tester</title>
  <style>
    * {color: gray}
${styles}
  </style>
</head>
<body>
${html_body}
</body>
</html>"""

feature_name_style_template="""\
    @media all and (${feature_name}) {
      #${feature_name} {
        color: black; font-weight: bold;
      }
    }
"""

feature_value_style_template="""\
    @media all and (${prefixed_feature_name}: ${feature_value}) {
      #${prefixed_feature_name}_${feature_value_id} {
        color: green; font-weight: bold; border: 1px solid green
      }
    }
"""

feature_block_template="""\
  <div style="margin: 10px;">
    <span id="${feature_name}">${feature_name_label}:</span>
${feature_value_blocks}
  </div>
"""

feature_value_block_template="""\
    <span id="${prefixed_feature_name}_${feature_value_id}">${feature_value}</span>
"""

# ======= Generator code =======
styles=""
html_body=""
for mq_feature in mq_features:
    if (mq_feature.prefix is None):
        feature_name_label = mq_feature.name
        prefixed_feature_name = mq_feature.name
    else:
        feature_name_label = mq_feature.name + " (" + mq_feature.prefix + ")"
        prefixed_feature_name = mq_feature.prefix + "-" + mq_feature.name

    styles += Template(feature_name_style_template).substitute(
        {"feature_name" : mq_feature.name,
         "prefixed_feature_name" : prefixed_feature_name})

    feature_value_blocks = ""
    for feature_value in mq_feature.values:
        mappings = {"prefixed_feature_name" : prefixed_feature_name,
                    "feature_value" : feature_value,
                    "feature_value_id": feature_value.replace(".", "_")}

        styles += Template(
            feature_value_style_template).substitute(mappings)

        feature_value_blocks += Template(
            feature_value_block_template).substitute(mappings)


    feature_block = Template(feature_block_template).substitute(
        {"feature_name" : mq_feature.name,
         "feature_name_label" : feature_name_label,
         "feature_value_blocks" : feature_value_blocks})

    html_body += feature_block


print(Template(html_template).substitute({"styles" : styles, "html_body" : html_body}))
