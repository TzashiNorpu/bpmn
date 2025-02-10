package tz.tzashi.norpu;

import lombok.extern.slf4j.Slf4j;
import org.flowable.engine.ProcessEngine;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Slf4j
public class FlowableTest {

    @Autowired
    private ProcessEngine processEngine;

    @Test
    public void testProcessEngine(){
        log.info("processEngine = {}" , processEngine);
    }
}
