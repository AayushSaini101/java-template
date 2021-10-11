/*
 * Below you can see how to create reusable chunks/components/helpers.
 * Check the files in the `template` folder to see how to import and use them within a template.
 */
import { Indent, IndentationTypes, withIndendation } from '@asyncapi/generator-react-sdk';
import { asyncApiTypeToJavaType, createJavaArgsFromProperties } from '../utils/Types.utils'
/*
  * Each component has a `childrenContent` property.
  * It is the processed children content of a component into a pure string. You can use it for compositions in your component.
  * 
  * Example:
  * function CustomComponent({ childrenContent }) {
  *   return `some text at the beginning: ${childrenContent}`
  * }
  * 
  * function RootComponent() {
  *   return (
  *     <CustomComponent>
  *       some text at the end.
  *     </CustomComponent>
  *   );
  * }
  * 
  * then output from RootComponent will be `some text at the beginning: some text at the end.`.
  */

export function Class({ childrenContent, name, implementsClass }) {
  let implementsString = "";

  if(implementsClass != null){
    implementsString = `implements ${implementsClass}`
  }
  return `
public class ${name} ${implementsString}{
  ${childrenContent}
}
`;
}

export function ClassHeader({ }) {
return `
  private static final Logger logger = Logger.getLogger("com.ibm.mq.samples.jms");

  public static final String PRODUCER_PUT = "queue";
  public static final String PRODUCER_PUB = "topic";

  private JMSContext context = null;
  private Destination destination = null;
  private JMSProducer producer = null;
  private ConnectionHelper ch = null;`
}



export function passJavaArgs(properties){  return Object.entries(properties).map(([name, property]) => {
      return `${name}`
  })
}

export function defineJavaVars(properties){
  return Object.entries(properties).map(([name, property]) => {
      return `public ${asyncApiTypeToJavaType(property.type())} ${name};`
  })
}

export function setJavaVars(properties){
  return Object.entries(properties).map(([name, property]) => {
      return `
  this.${name} = ${name};
`
  })
}



export function ClassConstructor({ childrenContent, name, properties }) {
  let propertiesString = `String type`;
  

  console.log(`Constructing ${name}, properties`, properties)
  if(properties){
    propertiesString = createJavaArgsFromProperties(properties);

  }

  return `
  public ${name}(${propertiesString}) {
    ${childrenContent}
  }`
}

export function PackageDeclaration({ path }) {
  return `
package ${path};
  `
}

export function ImportDeclaration({ path }) {
  return `
import ${path};`
}

export function Imports() {
  return `
import java.util.logging.*;
import java.io.Serializable;

import javax.jms.Destination;
import javax.jms.JMSProducer;
import javax.jms.JMSContext;
import javax.jms.Message;
import javax.jms.JMSRuntimeException;
import javax.jms.ObjectMessage;


import com.ibm.mq.samples.jms.ConnectionHelper;
import com.ibm.mq.samples.jms.LoggingHelper;
import com.ibm.mq.samples.jms.Connection;

import com.fasterxml.jackson.databind.ObjectMapper; 
import com.fasterxml.jackson.databind.ObjectWriter; 
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.annotation.JsonView;

  `
}

export function getMqValues(url, val) {
  var reg = new RegExp("(?<=ibmmq://.*/).*/.*", "gm");
  const splitVals = reg.exec(url).toString().split("/");
  if (val == 'qmgr')
      return splitVals[0];
  if (val == 'mqChannel')
      return splitVals[1];
    
  }
  
export function URLtoHost(url) {
    const u = new URL(url);
    return u.host;
  }
export function URLtoPort(url, defaultPort) {
    const u = new URL(url);
    return u.port || defaultPort;
  }


export function RecordFaliure({ asyncApi }) {
  
  //TODO remove hardcode
  
  return `
  private void recordFailure(Exception ex) {
    if (ex != null) {
        if (ex instanceof JMSException) {
            processJMSException((JMSException) ex);
        } else {
            logger.warning(ex.getMessage());
        }
    }
    logger.info("FAILURE");
    return;
  }
`
}

export function ProcessJMSException({ asyncApi }) {
  
  //TODO remove hardcode
  
  return `
  private void processJMSException(JMSException jmsex) {
    logger.warning(jmsex.getMessage());
    Throwable innerException = jmsex.getLinkedException();
    logger.warning("Exception is: " + jmsex);
    if (innerException != null) {
        logger.warning("Inner exception(s):");
    }
    while (innerException != null) {
        logger.warning(innerException.getMessage());
        innerException = innerException.getCause();
    }
    return;
}
`
}

export function Close({ asyncApi, channel }) {
  // TODO one of can be used in message apparently?
  return `
public void close() {
    ch.closeContext();
    ch = null;
}`
}

export function ImportModels({ messages }) {
  const namesList = Object.entries(messages)
    .map(([messageName, message]) => {
      return `import com.ibm.mq.samples.jms.models.${messageName.charAt(0).toUpperCase() + messageName.slice(1)};`
    });

  return namesList;
}