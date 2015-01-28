#!/usr/bin/python
# Generator for mq-test.html

from string import Template

#======= Media query features =======
class MQFeature:
    def __init__(self, feature_name, feature_values, feature_prefix = None):
        self.name = feature_name
        self.values = feature_values
        self.prefix = feature_prefix

mq_features = [
    MQFeature("pointer", ["none", "coarse", "fine"]),
    MQFeature("any-pointer", ["none", "coarse", "fine"]),
    MQFeature("hover", ["none", "on-demand", "hover"]),
    MQFeature("any-hover", ["none", "on-demand", "hover"]),
    MQFeature("scan", ["interlace", "progressive"]),
    MQFeature("color", ["1", "2", "4", "8", "16"], "min"),
]

#======= Templates =======

html_template="""\
<!DOCTYPE html>
<html>
<head>
  <meta name="description" content="Media query tester">
  <meta charset="utf-8">
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
      #${feature_name} {color: black; font-weight: bold;}
    }
"""

feature_value_style_template="""\
    @media all and (${prefixed_feature_name}: ${feature_value}) {
      #${prefixed_feature_name}_${feature_value} {color: red; font-weight: bold;}
    }
"""

feature_block_template="""\
  <div>
    <span id="${feature_name}">${feature_name_label}:</span>
${feature_value_blocks}
  </div>
"""

feature_value_block_template="""\
    <span id="${prefixed_feature_name}_${feature_value}">${feature_value}</span>
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
                    "feature_value" : feature_value}

        styles += Template(
            feature_value_style_template).substitute(mappings)

        feature_value_blocks += Template(
            feature_value_block_template).substitute(mappings)


    feature_block = Template(feature_block_template).substitute(
        {"feature_name" : mq_feature.name,
         "feature_name_label" : feature_name_label,
         "prefixed_feature_name" : prefixed_feature_name,
         "feature_value_blocks" : feature_value_blocks})

    html_body += feature_block


print Template(html_template).substitute({"styles" : styles, "html_body" : html_body})
