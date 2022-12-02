tensorflowjs_converter --input_format=tf_saved_model --output_format=tfjs_graph_model --signature_name=serving_default  --saved_model_tags=serve /model/film_net/L1/saved_model/ /models/tfjs/L1

# tensorflowjs_converter --input_format=tf_saved_model --output_format=tfjs_graph_model --signature_name=serving_default  --saved_model_tags=serve /model/film_net/Style/saved_model /models/tfjs/Style

# tensorflowjs_converter --input_format=tf_saved_model --output_format=tfjs_graph_model --signature_name=serving_default  --saved_model_tags=serve /model/film_net/VGG/saved_model/ /models/tfjs/VGG


